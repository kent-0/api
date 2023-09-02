import { Migration } from '@mikro-orm/migrations';

export class Migration20230902232211 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "boards_steps" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "board_id" uuid not null, "description" varchar null, "max" int not null, "name" varchar not null, "position" int not null, constraint "boards_steps_pkey" primary key ("id"));');
    this.addSql('comment on table "boards_steps" is \'Steps to complete per task.\';');
    this.addSql('comment on column "boards_steps"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "boards_steps"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "boards_steps"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "boards_steps"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "boards_steps"."board_id" is \'Board assigned to the task step.\';');
    this.addSql('comment on column "boards_steps"."description" is \'Brief description of what the step is about.\';');
    this.addSql('comment on column "boards_steps"."max" is \'Maximum number of tasks assigned to the step.\';');
    this.addSql('comment on column "boards_steps"."name" is \'Name of the step.\';');
    this.addSql('comment on column "boards_steps"."position" is \'Step position on the board.\';');

    this.addSql('create table "boards_tasks" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null, "updated_at" timestamp not null, "version" int not null default 1, "assigned_to_id" uuid null, "board_id" uuid not null, "created_by_id" uuid not null, "description" varchar not null, "expiration_date" timestamp null, "name" varchar null, "position" int not null, "step_id" uuid not null, constraint "boards_tasks_pkey" primary key ("id"));');
    this.addSql('comment on table "boards_tasks" is \'Tasks created for the board.\';');
    this.addSql('comment on column "boards_tasks"."id" is \'UUID v4 unique to the row.\';');
    this.addSql('comment on column "boards_tasks"."created_at" is \'Date when the row was created.\';');
    this.addSql('comment on column "boards_tasks"."updated_at" is \'Date when the row was last updated.\';');
    this.addSql('comment on column "boards_tasks"."version" is \'Optimistic Locking transactions.\';');
    this.addSql('comment on column "boards_tasks"."assigned_to_id" is \'Member assigned to the task.\';');
    this.addSql('comment on column "boards_tasks"."board_id" is \'Board on which tasks are assigned.\';');
    this.addSql('comment on column "boards_tasks"."created_by_id" is \'Member who created the task.\';');
    this.addSql('comment on column "boards_tasks"."description" is \'Description about the task, such as how the implementation should work, etc.\';');
    this.addSql('comment on column "boards_tasks"."expiration_date" is \'Date on which the task should be finished.\';');
    this.addSql('comment on column "boards_tasks"."name" is \'Name of the task.\';');
    this.addSql('comment on column "boards_tasks"."position" is \'Task position on the step.\';');
    this.addSql('comment on column "boards_tasks"."step_id" is \'Step in which the task is assigned.\';');

    this.addSql('alter table "boards_steps" add constraint "boards_steps_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_assigned_to_id_foreign" foreign key ("assigned_to_id") references "auth_users" ("id") on update cascade on delete set null;');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade;');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_created_by_id_foreign" foreign key ("created_by_id") references "auth_users" ("id") on update cascade;');
    this.addSql('alter table "boards_tasks" add constraint "boards_tasks_step_id_foreign" foreign key ("step_id") references "boards_steps" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_tasks" drop constraint "boards_tasks_step_id_foreign";');

    this.addSql('drop table if exists "boards_steps" cascade;');

    this.addSql('drop table if exists "boards_tasks" cascade;');
  }

}
