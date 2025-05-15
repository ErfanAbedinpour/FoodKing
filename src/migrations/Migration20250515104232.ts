import { Migration } from '@mikro-orm/migrations';

export class Migration20250515104232 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Role" drop constraint if exists "Role_name_check";`);

    this.addSql(`alter table "Role" add constraint "Role_name_check" check("name" in ('Customer', 'Delivery', 'Owner'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "Role" drop constraint if exists "Role_name_check";`);

    this.addSql(`alter table "Role" add constraint "Role_name_check" check("name" in ('Customer', 'Manager', 'Delivery', 'Owner'));`);
  }

}
