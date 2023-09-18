import { Migration } from '@mikro-orm/migrations';

export class Migration20230918025634 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_members" drop constraint "boards_members_board_id_foreign";');

    this.addSql('comment on column "auth_tokens"."token_value" is \'The actual value of the token, which is sent in requests for authentication and authorization.\';');

    this.addSql('alter table "boards_steps" add column "finish_step" bool not null default false;');
    this.addSql('alter table "boards_steps" alter column "max" type int using ("max"::int);');
    this.addSql('alter table "boards_steps" alter column "max" drop not null;');
    this.addSql('comment on column "boards_steps"."finish_step" is \'Flag if this step is the final completion step of the step flow.\';');

    this.addSql('alter table "boards_members" add constraint "boards_members_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_members" drop constraint "boards_members_board_id_foreign";');

    this.addSql('comment on column "auth_tokens"."token_value" is null;');

    this.addSql('alter table "boards_steps" alter column "max" type int using ("max"::int);');
    this.addSql('alter table "boards_steps" alter column "max" set not null;');
    this.addSql('alter table "boards_steps" drop column "finish_step";');

    this.addSql('alter table "boards_members" add constraint "boards_members_board_id_foreign" foreign key ("board_id") references "boards" ("id") on update cascade;');
  }

}
