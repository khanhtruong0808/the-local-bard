alter table "public"."theater_managers" drop constraint "theater_managers_pkey";

drop index if exists "public"."theater_managers_pkey";

alter table "public"."theater_managers" alter column "user_id" set not null;

alter table "public"."theaters" add column "email" text;

CREATE UNIQUE INDEX theater_managers_pkey ON public.theater_managers USING btree (id, user_id);

alter table "public"."theater_managers" add constraint "theater_managers_pkey" PRIMARY KEY using index "theater_managers_pkey";
