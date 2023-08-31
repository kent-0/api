import { Migration } from '@mikro-orm/migrations';

export class Migration20230831053324 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_tokens" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "expiration" timestamp not null, "token_type" text check ("token_type" in (\'auth\', \'refresh\')) not null, "token_value" varchar not null, "user_id_id" uuid not null, constraint "auth_tokens_pkey" primary key ("id"));');
    this.addSql('comment on table "auth_tokens" is \'Access and refresh tokens created in user sessions.\';');
    this.addSql('comment on column "auth_tokens"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "auth_tokens"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "auth_tokens"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "auth_tokens"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "auth_tokens"."expiration" is \'Token expiration date.\';');
    this.addSql('comment on column "auth_tokens"."token_type" is \'Type of token generated.\';');
    this.addSql('comment on column "auth_tokens"."user_id_id" is \'Relationship to the user assigned to the generated token.\';');
    this.addSql('alter table "auth_tokens" add constraint "auth_tokens_token_value_unique" unique ("token_value");');

    this.addSql('alter table "auth_tokens" add constraint "auth_tokens_user_id_id_foreign" foreign key ("user_id_id") references "auth_users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "auth_tokens" cascade;');
  }

}
