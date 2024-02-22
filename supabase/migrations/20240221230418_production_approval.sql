drop policy "All users can view all productions." on "public"."productions";

alter table "public"."productions" drop constraint "productions_stage_id_fkey";

alter table "public"."productions" drop constraint "productions_theater_id_fkey";

alter table "public"."productions" add column "approved" boolean not null default false;

alter table "public"."productions" add constraint "public_productions_stage_id_fkey" FOREIGN KEY (stage_id) REFERENCES stages(id) ON UPDATE CASCADE not valid;

alter table "public"."productions" validate constraint "public_productions_stage_id_fkey";

alter table "public"."productions" add constraint "public_productions_theater_id_fkey" FOREIGN KEY (theater_id) REFERENCES theaters(id) ON UPDATE CASCADE not valid;

alter table "public"."productions" validate constraint "public_productions_theater_id_fkey";

create policy "All users can view all admin-approved productions."
on "public"."productions"
as permissive
for select
to public
using ((approved = true));


create policy "Theater managers can see their own non-approved productions."
on "public"."productions"
as permissive
for select
to authenticated
using (((approved = true) OR (auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (theaters.id = productions.theater_id)))));



