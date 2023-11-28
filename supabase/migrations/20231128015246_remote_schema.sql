alter table "public"."addresses" disable row level security;

alter table "public"."stages" add column "address_id" integer;

alter table "public"."stages" add constraint "stages_address_id_fkey" FOREIGN KEY (address_id) REFERENCES addresses(id) not valid;

alter table "public"."stages" validate constraint "stages_address_id_fkey";

create policy "All users can create their own address."
on "public"."addresses"
as permissive
for insert
to public
with check (true);


create policy "All users can create their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check (true);



