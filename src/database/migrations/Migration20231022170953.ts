import { Migration } from '@mikro-orm/migrations';

export class Migration20231022170953 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_tasks" drop constraint "boards_tasks_step_id_foreign";');

    this.addSql('alter table "boards_tasks" alter column "step_id" drop default;');
    this.addSql('alter table "boards_tasks" alter column "step_id" type uuid using ("step_id"::text::uuid);');
    this.addSql('alter table "boards_tasks" alter column "step_id" drop not null;');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_step_id_foreign" foreign key ("step_id") references "boards_steps" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tasks" drop constraint "boards_tasks_step_id_foreign";');

    this.addSql('alter table "boards_tasks" alter column "step_id" drop default;');
    this.addSql('alter table "boards_tasks" alter column "step_id" type uuid using ("step_id"::text::uuid);');
    this.addSql('alter table "boards_tasks" alter column "step_id" set not null;');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_step_id_foreign" foreign key ("step_id") references "boards_steps" ("id") on update cascade;');
  }

}
