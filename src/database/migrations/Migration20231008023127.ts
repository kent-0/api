import { Migration } from '@mikro-orm/migrations';

export class Migration20231008023127 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_tasks" alter column "name" type varchar using ("name"::varchar);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tasks" alter column "name" type varchar using ("name"::varchar);');
  }

}
