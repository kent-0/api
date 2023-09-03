import { Migration } from '@mikro-orm/migrations';

export class Migration20230903000234 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_tags" alter column "color" type varchar using ("color"::varchar);');
    this.addSql('alter table "boards_tags" alter column "color" drop not null;');

    this.addSql('alter table "boards_tasks" add column "finish_date" timestamp null, add column "start_date" timestamp null;');
    this.addSql('alter table "boards_tasks" alter column "name" type varchar using ("name"::varchar);');
    this.addSql('alter table "boards_tasks" alter column "name" set not null;');
    this.addSql('comment on column "boards_tasks"."finish_date" is \'Date on which the task end.\';');
    this.addSql('comment on column "boards_tasks"."start_date" is \'Date on which the task began.\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tags" alter column "color" type varchar using ("color"::varchar);');
    this.addSql('alter table "boards_tags" alter column "color" set not null;');

    this.addSql('alter table "boards_tasks" alter column "name" type varchar using ("name"::varchar);');
    this.addSql('alter table "boards_tasks" alter column "name" drop not null;');
    this.addSql('alter table "boards_tasks" drop column "finish_date";');
    this.addSql('alter table "boards_tasks" drop column "start_date";');
  }

}
