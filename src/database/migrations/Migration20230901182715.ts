import { Migration } from '@mikro-orm/migrations';

export class Migration20230901182715 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_emails" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "activation_token" varchar(255) null default substr(md5(random()::text), 0, 10), "is_confirmed" boolean not null default false, "user_id" uuid not null, "value" varchar not null, constraint "auth_emails_pkey" primary key ("id"), constraint auth_emails_value_check check (email ~ \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$\'));');
    this.addSql('comment on table "auth_emails" is \'Status of emails linked to user accounts.\';');
    this.addSql('comment on column "auth_emails"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "auth_emails"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "auth_emails"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "auth_emails"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "auth_emails"."activation_token" is \'Mail confirmation token.\';');
    this.addSql('comment on column "auth_emails"."is_confirmed" is \'Mail status confirmed or not.\';');
    this.addSql('comment on column "auth_emails"."user_id" is \'Relationship to the user assigned to the created email.\';');
    this.addSql('comment on column "auth_emails"."value" is \'Unique email per user.\';');
    this.addSql('alter table "auth_emails" add constraint "auth_emails_user_id_unique" unique ("user_id");');
    this.addSql('alter table "auth_emails" add constraint "auth_emails_value_unique" unique ("value");');

    this.addSql('alter table "auth_emails" add constraint "auth_emails_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "auth_users" add column "email_id" uuid null;');
    this.addSql('comment on column "auth_users"."email_id" is \'Relationship to the user assigned to the created email.\';');
    this.addSql('alter table "auth_users" drop constraint "auth_users_email_unique";');
    this.addSql('alter table "auth_users" drop constraint auth_users_email_check;');
    this.addSql('alter table "auth_users" add constraint "auth_users_email_id_foreign" foreign key ("email_id") references "auth_emails" ("id") on update cascade on delete set null;');
    this.addSql('alter table "auth_users" drop column "email";');
    this.addSql('alter table "auth_users" add constraint "auth_users_email_id_unique" unique ("email_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_users" drop constraint "auth_users_email_id_foreign";');

    this.addSql('drop table if exists "auth_emails" cascade;');

    this.addSql('alter table "auth_users" add column "email" varchar not null;');
    this.addSql('comment on column "auth_users"."email" is \'Unique email per user.\';');
    this.addSql('alter table "auth_users" drop constraint "auth_users_email_id_unique";');
    this.addSql('alter table "auth_users" drop column "email_id";');
    this.addSql('alter table "auth_users" add constraint "auth_users_email_unique" unique ("email");');
    this.addSql('alter table "auth_users" add constraint auth_users_email_check check(email ~ \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$\');');
  }

}
