import { Migration } from '@mikro-orm/migrations';

export class Migration20230903141210 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "activity_history" alter column "reference_id" drop default;');
    this.addSql('alter table "activity_history" alter column "reference_id" type uuid using ("reference_id"::text::uuid);');
    this.addSql('alter table "activity_history" alter column "reference_id" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "activity_history" alter column "reference_id" drop default;');
    this.addSql('alter table "activity_history" alter column "reference_id" type uuid using ("reference_id"::text::uuid);');
    this.addSql('alter table "activity_history" alter column "reference_id" set not null;');
  }

}
