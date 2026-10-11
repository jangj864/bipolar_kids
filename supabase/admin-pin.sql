create schema if not exists private;
create table private.admin_pin (
 id boolean primary key default true check(id),
 pin_hash text not null,
 admin_email text not null,
 window_started timestamptz not null default now(),
 attempts integer not null default 0
);
alter table private.admin_pin enable row level security;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;
revoke all on private.admin_pin from public, anon, authenticated;
grant select,update on private.admin_pin to service_role;
insert into private.admin_pin(id,pin_hash,admin_email)
values(true,extensions.crypt('0000',extensions.gen_salt('bf',10)),'ddoazoo@gmail.com');
create function public.verify_admin_pin(input_pin text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare row private.admin_pin;
begin
 update private.admin_pin set
 attempts=case when window_started < now()-interval '1 minute' then 1 else attempts+1 end,
 window_started=case when window_started < now()-interval '1 minute' then now() else window_started end
 where id=true returning * into row;
 if row.attempts > 10 then return jsonb_build_object('limited',true); end if;
 if input_pin is null or input_pin !~ '^[0-9]{4}$' or extensions.crypt(input_pin,row.pin_hash) <> row.pin_hash then
 return jsonb_build_object('valid',false); end if;
 return jsonb_build_object('valid',true,'email',row.admin_email);
end $$;
revoke all on function public.verify_admin_pin(text) from public,anon,authenticated;
grant execute on function public.verify_admin_pin(text) to service_role;
grant select,insert,update on public.site_admins to service_role;
