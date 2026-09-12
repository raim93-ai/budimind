-- BudiMind Clinical/Public baseline. Apply only to the clinical project.
create schema if not exists private;

revoke all on schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;
