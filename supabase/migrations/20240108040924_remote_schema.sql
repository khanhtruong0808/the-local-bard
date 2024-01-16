create extension if not exists "pg_trgm" with schema "public" version '1.6';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_production_ids(search_term character varying)
 RETURNS TABLE(id integer)
 LANGUAGE plpgsql
AS $function$
  begin
    return query
      SELECT
        productions.id
      FROM productions
      WHERE word_similarity(search_term, productions.name) > 0.3;
  end;
$function$
;


