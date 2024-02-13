create extension if not exists "moddatetime" with schema "extensions";


drop policy "All users can create their own address." on "public"."addresses";

drop policy "Users can update their own address." on "public"."addresses";

drop policy "Theater Manager Users can create productions for their own thea" on "public"."productions";

drop policy "Theater Manager Users can delete their own productions." on "public"."productions";

drop policy "Theater Manager Users can update their own productions." on "public"."productions";

drop policy "All users can create their own profile." on "public"."profiles";

drop policy "Users can update their own profiles." on "public"."profiles";

drop policy "Theater Manager Users can create stages for their own theaters." on "public"."stages";

drop policy "Theater Manager Users can delete their own stages." on "public"."stages";

drop policy "Theater Manager Users can update their own stages." on "public"."stages";

drop policy "All users can view all theater managers." on "public"."theater_managers";

drop policy "Theater Manager Users can update their own theaters." on "public"."theaters";

revoke delete on table "public"."theater_managers" from "anon";

revoke insert on table "public"."theater_managers" from "anon";

revoke references on table "public"."theater_managers" from "anon";

revoke select on table "public"."theater_managers" from "anon";

revoke trigger on table "public"."theater_managers" from "anon";

revoke truncate on table "public"."theater_managers" from "anon";

revoke update on table "public"."theater_managers" from "anon";

revoke delete on table "public"."theater_managers" from "authenticated";

revoke insert on table "public"."theater_managers" from "authenticated";

revoke references on table "public"."theater_managers" from "authenticated";

revoke select on table "public"."theater_managers" from "authenticated";

revoke trigger on table "public"."theater_managers" from "authenticated";

revoke truncate on table "public"."theater_managers" from "authenticated";

revoke update on table "public"."theater_managers" from "authenticated";

revoke delete on table "public"."theater_managers" from "service_role";

revoke insert on table "public"."theater_managers" from "service_role";

revoke references on table "public"."theater_managers" from "service_role";

revoke select on table "public"."theater_managers" from "service_role";

revoke trigger on table "public"."theater_managers" from "service_role";

revoke truncate on table "public"."theater_managers" from "service_role";

revoke update on table "public"."theater_managers" from "service_role";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."theater_managers" drop constraint "theater_managers_theater_id_fkey";

alter table "public"."theater_managers" drop constraint "theater_managers_user_id_fkey";

alter table "public"."theater_managers" drop constraint "theater_managers_pkey";

drop index if exists "public"."theater_managers_pkey";

drop table "public"."theater_managers";

alter table "public"."addresses" alter column "city" set not null;

alter table "public"."addresses" alter column "country" set default 'United States'::text;

alter table "public"."addresses" alter column "postal_code" set data type character varying using "postal_code"::character varying;

alter table "public"."addresses" alter column "postal_code" set default '10'::character varying;

alter table "public"."addresses" alter column "street_address" set not null;

alter table "public"."addresses" enable row level security;

alter table "public"."productions" drop column "type";

alter table "public"."productions" drop column "writers";

alter table "public"."productions" add column "genres" text[] not null default '{}'::text[];

alter table "public"."productions" add column "playwrights" text[] not null default '{}'::text[];

alter table "public"."productions" alter column "composers" set default '{}'::text[];

alter table "public"."productions" alter column "composers" set not null;

alter table "public"."productions" alter column "cost_range" set not null;

alter table "public"."productions" alter column "created_at" set not null;

alter table "public"."productions" alter column "directors" set default '{}'::text[];

alter table "public"."productions" alter column "directors" set not null;

alter table "public"."productions" alter column "duration_minutes" set not null;

alter table "public"."productions" alter column "end_date" set not null;

alter table "public"."productions" alter column "kid_friendly" set default true;

alter table "public"."productions" alter column "kid_friendly" set not null;

alter table "public"."productions" alter column "name" set not null;

alter table "public"."productions" alter column "stage_id" set not null;

alter table "public"."productions" alter column "start_date" set not null;

alter table "public"."productions" alter column "theater_id" set not null;

alter table "public"."productions" alter column "updated_at" set not null;

alter table "public"."profiles" add column "user_id" uuid not null;

alter table "public"."profiles" alter column "id" set default gen_random_uuid();

alter table "public"."theaters" drop column "email";

alter table "public"."theaters" drop column "phone";

alter table "public"."theaters" add column "manager_id" uuid not null;

alter table "public"."theaters" alter column "address_id" set not null;

alter table "public"."theaters" alter column "created_at" set not null;

alter table "public"."theaters" alter column "name" set not null;

alter table "public"."theaters" alter column "updated_at" set not null;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."theaters" add constraint "theaters_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES auth.users(id) ON UPDATE CASCADE not valid;

alter table "public"."theaters" validate constraint "theaters_manager_id_fkey";

create policy "Authenticated users can create their own address."
on "public"."addresses"
as permissive
for insert
to authenticated
with check ((auth.uid() = ( SELECT profiles.user_id
   FROM profiles
  WHERE (addresses.id = profiles.address_id))));


create policy "Authenticated users can update their own address."
on "public"."addresses"
as permissive
for update
to authenticated
using ((auth.uid() = ( SELECT profiles.user_id
   FROM profiles
  WHERE (addresses.id = profiles.address_id))))
with check ((auth.uid() = ( SELECT profiles.user_id
   FROM profiles
  WHERE (addresses.id = profiles.address_id))));


create policy "Theater managers can create productions for their own theater"
on "public"."productions"
as permissive
for insert
to authenticated
with check ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = productions.theater_id))));


create policy "Theater managers can delete productions for their own theater"
on "public"."productions"
as permissive
for delete
to authenticated
using ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = productions.theater_id))));


create policy "Theater managers can update productions in their own theater"
on "public"."productions"
as permissive
for update
to authenticated
using ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = productions.theater_id))))
with check ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = productions.theater_id))));


create policy "Authenticated users can create their own profile."
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Authenticated users can update their own profiles."
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Theater managers can create stages for their own theater"
on "public"."stages"
as permissive
for insert
to authenticated
with check ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = stages.theater_id))));


create policy "Theater managers can delete their own theater's stages"
on "public"."stages"
as permissive
for delete
to authenticated
using ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = stages.theater_id))));


create policy "Theater managers can update their own theater's stages"
on "public"."stages"
as permissive
for update
to authenticated
using ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = stages.theater_id))))
with check ((auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = stages.theater_id))));


create policy "Theater managers can update their own theater"
on "public"."theaters"
as permissive
for update
to authenticated
using ((auth.uid() = manager_id))
with check ((auth.uid() = manager_id));


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.productions FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_productions BEFORE UPDATE ON public.productions FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_stages BEFORE UPDATE ON public.stages FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');
