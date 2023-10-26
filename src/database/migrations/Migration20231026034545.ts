import { Migration } from '@mikro-orm/migrations';

export class Migration20231026034545 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "boards_roles" add column "permissions_denied" numeric not null, add column "position" numeric not null;');
    this.addSql('comment on column "boards_roles"."permissions_denied" is \'Role bit-based permissions that are denied.\';');
    this.addSql('comment on column "boards_roles"."position" is \'Position of the role in the project.\';');
    this.addSql('alter table "boards_roles" rename column "permissions" to "permissions_granted";');

    this.addSql('alter table "projects_roles" add column "permissions_denied" numeric not null, add column "position" numeric not null;');
    this.addSql('comment on column "projects_roles"."permissions_denied" is \'Role bit-based permissions that are denied.\';');
    this.addSql('comment on column "projects_roles"."position" is \'Position of the role in the project.\';');
    this.addSql('alter table "projects_roles" rename column "permissions" to "permissions_granted";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "boards_roles" drop column "permissions_denied";');
    this.addSql('alter table "boards_roles" drop column "position";');
    this.addSql('alter table "boards_roles" rename column "permissions_granted" to "permissions";');

    this.addSql('alter table "projects_roles" drop column "permissions_denied";');
    this.addSql('alter table "projects_roles" drop column "position";');
    this.addSql('alter table "projects_roles" rename column "permissions_granted" to "permissions";');
  }

}
