import { Migration } from '@mikro-orm/migrations';

export class Migration20230831053659 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_tokens" add column "device" varchar not null;');
    this.addSql('comment on column "auth_tokens"."device" is \'Name of the device used to generate the token.\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_tokens" drop column "device";');
  }

}
