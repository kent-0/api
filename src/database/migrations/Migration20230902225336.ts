import { Migration } from '@mikro-orm/migrations';

export class Migration20230902225336 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards" add column "description" varchar not null;');
    this.addSql('comment on column "boards"."description" is \'Brief description of the board.\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards" drop column "description";');
  }

}
