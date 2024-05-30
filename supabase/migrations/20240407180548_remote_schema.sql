alter table "auth"."flow_state" add column if not exists "auth_code_issued_at" timestamp with time zone;

alter table "auth"."saml_providers" add column if not exists "name_id_format" text;

alter table "auth"."saml_relay_states" drop column if exists "from_ip_address";

alter table "auth"."users" add column if not exists "is_anonymous" boolean not null default false;

CREATE INDEX if not exists users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


alter table "public"."stages" add column if not exists "concessions" text;

alter table "public"."stages" add column if not exists "parking_instructions" text;

alter table "public"."theaters" drop column if exists "concessions";

alter table "public"."theaters" drop column if exists "parking_instructions";
