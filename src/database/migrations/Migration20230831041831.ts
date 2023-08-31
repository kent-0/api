import { Migration } from '@mikro-orm/migrations';

export class Migration20230831041831 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_users" ("id" uuid not null default uuid_generate_v4(), "created_at" date not null, "updated_at" date not null, "version" int not null default 1, "email" varchar not null, "first_name" varchar not null, "last_name" varchar not null, "username" varchar not null, constraint "auth_users_pkey" primary key ("id"), constraint auth_users_username_check check (username ~ \'^[A-Za-z0-9_-]+$\'));');
    this.addSql('comment on column "auth_users"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "auth_users"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "auth_users"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "auth_users"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "auth_users"."email" is \'Unique email per user.\';');
    this.addSql('comment on column "auth_users"."first_name" is \'First name of the user\';');
    this.addSql('comment on column "auth_users"."last_name" is \'Last name of the user\';');
    this.addSql('comment on column "auth_users"."username" is \'Unique user name per user.\';');
    this.addSql('alter table "auth_users" add constraint "auth_users_email_unique" unique ("email");');
    this.addSql('alter table "auth_users" add constraint "auth_users_username_unique" unique ("username");');
  }

}
