import { Migration } from '@mikro-orm/migrations';

export class Migration20230902171333 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_users" add column "biography" varchar null;');
    this.addSql('comment on column "auth_users"."biography" is \'Biography of the user account.\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_users" drop column "biography";');
  }

}
