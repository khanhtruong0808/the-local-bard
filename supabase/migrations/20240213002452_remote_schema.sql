drop policy "Authenticated users can create their own address." on "public"."addresses";

drop policy "Authenticated users can update their own address." on "public"."addresses";

create policy "Authenticated users can create any address."
on "public"."addresses"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can update their own address."
on "public"."addresses"
as permissive
for update
to authenticated
using (((auth.uid() = ( SELECT profiles.user_id
   FROM profiles
  WHERE (addresses.id = profiles.address_id))) OR (auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (addresses.id = theaters.address_id)))))
with check (((auth.uid() = ( SELECT profiles.user_id
   FROM profiles
  WHERE (addresses.id = profiles.address_id))) OR (auth.uid() = ( SELECT theaters.manager_id
   FROM theaters
  WHERE (addresses.id = theaters.address_id)))));



create policy "Any users can access all posters"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'posters'::text));


create policy "Authenticated users can update posters 1sk75qe_0"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'posters'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Authenticated users can upload posters 1sk75qe_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'posters'::text) AND (auth.role() = 'authenticated'::text)));



