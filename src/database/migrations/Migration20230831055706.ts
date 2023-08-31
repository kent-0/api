import { Migration } from '@mikro-orm/migrations';

export class Migration20230831055706 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_passwords" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "password_hash" varchar not null, "salt" varchar not null, "user_id" uuid not null, constraint "auth_passwords_pkey" primary key ("id"));');
    this.addSql('comment on table "auth_passwords" is \'Passwords assigned to user accounts.\';');
    this.addSql('comment on column "auth_passwords"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "auth_passwords"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "auth_passwords"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "auth_passwords"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "auth_passwords"."password_hash" is \'Hash resulting from the password combined with the "salt".\';');
    this.addSql('comment on column "auth_passwords"."salt" is \'Salt used during the hashing process.\';');
    this.addSql('comment on column "auth_passwords"."user_id" is \'Relationship to the user assigned to the created password.\';');
    this.addSql('alter table "auth_passwords" add constraint "auth_passwords_password_hash_unique" unique ("password_hash");');
    this.addSql('alter table "auth_passwords" add constraint "auth_passwords_user_id_unique" unique ("user_id");');

    this.addSql('alter table "auth_passwords" add constraint "auth_passwords_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "auth_users" add column "password_id" uuid null;');
    this.addSql('comment on column "auth_users"."password_id" is \'Relationship to the user assigned to the created password.\';');
    this.addSql('alter table "auth_users" add constraint "auth_users_password_id_foreign" foreign key ("password_id") references "auth_passwords" ("id") on update cascade on delete set null;');
    this.addSql('alter table "auth_users" add constraint "auth_users_password_id_unique" unique ("password_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_users" drop constraint "auth_users_password_id_foreign";');

    this.addSql('drop table if exists "auth_passwords" cascade;');

    this.addSql('alter table "auth_users" drop constraint "auth_users_password_id_unique";');
    this.addSql('alter table "auth_users" drop column "password_id";');
  }

}
