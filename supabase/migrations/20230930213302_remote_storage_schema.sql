alter table "storage"."buckets" drop constraint if exists "buckets_owner_fkey";

alter table "storage"."buckets" add column if not exists "owner_id" text;

alter table "storage"."objects" add column if not exists "owner_id" text;
