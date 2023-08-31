import { Migration } from '@mikro-orm/migrations';

export class Migration20230831053743 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_tokens" drop constraint "auth_tokens_user_id_id_foreign";');

    this.addSql('alter table "auth_tokens" rename column "user_id_id" to "user_id";');
    this.addSql('alter table "auth_tokens" add constraint "auth_tokens_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_tokens" drop constraint "auth_tokens_user_id_foreign";');

    this.addSql('alter table "auth_tokens" rename column "user_id" to "user_id_id";');
    this.addSql('alter table "auth_tokens" add constraint "auth_tokens_user_id_id_foreign" foreign key ("user_id_id") references "auth_users" ("id") on update cascade;');
  }

}
