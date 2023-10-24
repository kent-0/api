import { Migration } from '@mikro-orm/migrations';

export class Migration20231020184055 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_tasks" add column "parent_id" uuid not null;');
    this.addSql('comment on column "boards_tasks"."parent_id" is \'Parent task.\';');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_parent_id_foreign" foreign key ("parent_id") references "boards_tasks" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tasks" drop constraint "boards_tasks_parent_id_foreign";');

    this.addSql('alter table "boards_tasks" drop column "parent_id";');
  }

}
