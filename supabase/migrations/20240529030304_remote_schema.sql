create schema if not exists "private";

create table "private"."keys" (
    "key" text not null,
    "value" text
);


CREATE UNIQUE INDEX keys_pkey ON private.keys USING btree (key);

alter table "private"."keys" add constraint "keys_pkey" PRIMARY KEY using index "keys_pkey";


create extension if not exists "http" with schema "public" version '1.5';

create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "recipient" text,
    "sender" text,
    "cc" text,
    "bcc" text,
    "subject" text,
    "text_body" text,
    "html_body" text,
    "created" timestamp with time zone default CURRENT_TIMESTAMP,
    "status" text,
    "deliveryresult" jsonb,
    "deliverysignature" jsonb,
    "log" jsonb
);


alter table "public"."messages" enable row level security;

alter table "public"."stages" drop column "concessions";

alter table "public"."stages" drop column "parking_instructions";

alter table "public"."stages" drop column "seating_capacity";

alter table "public"."stages" drop column "wheelchair_accessible";

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_email_message(message json)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare 
-- variable declaration
recipient text;
sender text;
cc text;
bcc text;
subject text;
text_body text;
html_body text;
retval text;
begin
  /*
  if not exists (message->>'recipient') then
    RAISE INFO 'messages.recipient missing';
  end if
  */
  select  message->>'recipient', 
          message->>'sender',
          message->>'cc',
          message->>'bcc',
          message->>'subject',
          message->>'text_body',
          message->>'html_body' into recipient, sender, cc, bcc, subject, text_body, html_body;
  
  if coalesce(sender, '') = '' then
    -- select 'no sender' into retval;
    RAISE EXCEPTION 'message.sender missing';
  elseif coalesce(recipient, '') = '' then
    RAISE EXCEPTION 'message.recipient missing';
  elseif coalesce(subject, '') = '' then
    RAISE EXCEPTION 'message.subject missing';
  elseif coalesce(text_body, '') = '' and coalesce(html_body, '') = '' then
    RAISE EXCEPTION 'message.text_body and message.html_body are both missing';
  end if;

  if coalesce(text_body, '') = '' then
    select html_body into text_body;
  elseif coalesce(html_body, '') = '' then
    select text_body into html_body;
  end if; 

  insert into public.messages(recipient, sender, cc, bcc, subject, text_body, html_body, status, log)
  values (recipient, sender, cc, bcc, subject, text_body, html_body, 'ready', '[]'::jsonb) returning id into retval;

  return retval;
end;
$function$
;

create type "public"."http_header" as ("field" character varying, "value" character varying);

create type "public"."http_request" as ("method" http_method, "uri" character varying, "headers" http_header[], "content_type" character varying, "content" character varying);

create type "public"."http_response" as ("status" integer, "content_type" character varying, "headers" http_header[], "content" character varying);

CREATE OR REPLACE FUNCTION public.send_email_message(message jsonb)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  -- variable declaration
  email_provider text := 'sendgrid'; -- 'mailgun', 'sendgrid', 'sendinblue', 'mailjet', 'mailersend'
  retval json;
  messageid text;
BEGIN


  IF message->'text_body' IS NULL AND message->'html_body' IS NULL THEN RAISE 'message.text_body or message.html_body is required'; END IF;
  
  IF message->'text_body' IS NULL THEN     
     select message || jsonb_build_object('text_body',message->>'html_body') into message;
  END IF;
  
  IF message->'html_body' IS NULL THEN 
     select message || jsonb_build_object('html_body',message->>'text_body') into message;
  END IF;  

  IF message->'recipient' IS NULL THEN RAISE 'message.recipient is required'; END IF;
  IF message->'sender' IS NULL THEN RAISE 'message.sender is required'; END IF;
  IF message->'subject' IS NULL THEN RAISE 'message.subject is required'; END IF;

  IF message->'messageid' IS NULL AND (SELECT to_regclass('public.messages')) IS NOT NULL THEN
    -- messages table exists, so save this message in the messages table
    INSERT INTO public.messages(recipient, sender, cc, bcc, subject, text_body, html_body, status, log)
    VALUES (message->'recipient', message->'sender', message->'cc', message->'bcc', message->'subject', message->'text_body', message->'html_body', 'ready', '[]'::jsonb) RETURNING id INTO messageid;
    select message || jsonb_build_object('messageid',messageid) into message;
  END IF;

  EXECUTE 'SELECT send_email_' || email_provider || '($1)' INTO retval USING message;
  -- SELECT send_email_mailgun(message) INTO retval;
  -- SELECT send_email_sendgrid(message) INTO retval;

  RETURN retval;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.send_email_message_trigger_fn()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  theater_manager_email text;
  json_payload TEXT;
  sender_email TEXT := 'The Local Bard <noreply@thelocalbard.com>';
BEGIN
  IF OLD.approved IS DISTINCT FROM NEW.approved AND NEW.approved IS TRUE THEN
    SELECT email FROM auth.users INTO theater_manager_email
    WHERE id = (
        SELECT manager_id FROM theaters
        WHERE id = NEW.theater_id
    );

    json_payload := '{"sender": "' || sender_email || '",' ||
                    '"recipient": "' || theater_manager_email || '",' ||
                    '"subject": "Your production has been approved!",' ||
                    '"html_body": "<html><body>Your production, ' || NEW.name || ' has been approved!</body></html>"}';

      PERFORM send_email_message(json_payload::jsonb);
  END IF;

  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.send_email_sendgrid(message jsonb)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  retval json;
  SENDGRID_API_KEY text;
BEGIN
  SELECT value::text INTO SENDGRID_API_KEY FROM private.keys WHERE key = 'SENDGRID_API_KEY';
  IF NOT found THEN RAISE 'missing entry in private.keys: SENDGRID_API_KEY'; END IF;

    SELECT
        * INTO retval
    FROM
        http (('POST', 
        'https://api.sendgrid.com/v3/mail/send', 
        ARRAY[http_header ('Authorization', 
        'Bearer ' || SENDGRID_API_KEY)], 
        'application/json',
        json_build_object(
            'personalizations',
            json_build_array(
                json_build_object(
                'to', json_build_array(
                    json_build_object('email', message->>'recipient')
                ))),
                'from', json_build_object('email', message->>'sender'),
                'subject', message->>'subject',
                'content', json_build_array(
                    json_build_object('type', 'text/plain', 'value', message->>'text_body'),
                    json_build_object('type', 'text/html', 'value', message->>'html_body')
                ),
                'custom_args', json_build_object(
                    'messageid', COALESCE(message->>'messageid',''))
        )::text));

        -- if the message table exists, 
        -- and the response from the mail server contains an id
        -- and the message from the mail server starts wtih 'Queued'
        -- mark this message as 'queued' in our message table, otherwise leave it as 'ready'
        
        IF (SELECT to_regclass('public.messages')) IS NOT NULL AND 
            retval::text = '202' THEN 
          UPDATE public.messages SET status = 'queued' WHERE id = (message->>'messageid')::UUID;
        ELSE
          RAISE 'error sending message with sendgrid: %',retval;
        END IF;

  RETURN retval;
END;
$function$
;

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

create policy "messages delete policy"
on "public"."messages"
as permissive
for delete
to public
using (false);


create policy "messages insert policy"
on "public"."messages"
as permissive
for insert
to public
with check (false);


create policy "messages select policy"
on "public"."messages"
as permissive
for select
to public
using (false);


create policy "messages update policy"
on "public"."messages"
as permissive
for update
to public
using (false)
with check (false);


CREATE TRIGGER approved_production_trigger AFTER UPDATE OF approved ON public.productions FOR EACH ROW EXECUTE FUNCTION send_email_message_trigger_fn();


