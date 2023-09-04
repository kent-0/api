import { Migration } from '@mikro-orm/migrations';

export class Migration20230904224902 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_members_roles" drop constraint "boards_members_roles_board_members_entity_id_foreign";');

    this.addSql('alter table "projects_members_roles" drop constraint "projects_members_roles_project_members_entity_id_foreign";');

    this.addSql('alter table "boards_members_roles" drop constraint "boards_members_roles_pkey";');
    this.addSql('alter table "boards_members_roles" rename column "board_members_entity_id" to "role_id";');
    this.addSql('alter table "boards_members_roles" add constraint "boards_members_roles_role_id_foreign" foreign key ("role_id") references "boards_members" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "boards_members_roles" add constraint "boards_members_roles_pkey" primary key ("role_id", "board_roles_entity_id");');

    this.addSql('alter table "projects_members_roles" drop constraint "projects_members_roles_pkey";');
    this.addSql('alter table "projects_members_roles" rename column "project_members_entity_id" to "role_id";');
    this.addSql('alter table "projects_members_roles" add constraint "projects_members_roles_role_id_foreign" foreign key ("role_id") references "projects_members" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "projects_members_roles" add constraint "projects_members_roles_pkey" primary key ("role_id", "project_roles_entity_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_members_roles" drop constraint "boards_members_roles_role_id_foreign";');

    this.addSql('alter table "projects_members_roles" drop constraint "projects_members_roles_role_id_foreign";');

    this.addSql('alter table "boards_members_roles" drop constraint "boards_members_roles_pkey";');
    this.addSql('alter table "boards_members_roles" rename column "role_id" to "board_members_entity_id";');
    this.addSql('alter table "boards_members_roles" add constraint "boards_members_roles_board_members_entity_id_foreign" foreign key ("board_members_entity_id") references "boards_members" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "boards_members_roles" add constraint "boards_members_roles_pkey" primary key ("board_members_entity_id", "board_roles_entity_id");');

    this.addSql('alter table "projects_members_roles" drop constraint "projects_members_roles_pkey";');
    this.addSql('alter table "projects_members_roles" rename column "role_id" to "project_members_entity_id";');
    this.addSql('alter table "projects_members_roles" add constraint "projects_members_roles_project_members_entity_id_foreign" foreign key ("project_members_entity_id") references "projects_members" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "projects_members_roles" add constraint "projects_members_roles_pkey" primary key ("project_members_entity_id", "project_roles_entity_id");');
  }

}
