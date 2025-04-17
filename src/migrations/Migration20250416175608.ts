import { Migration } from '@mikro-orm/migrations';

export class Migration20250416175608 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "User" drop constraint "User_role_id_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "User" add constraint "User_role_id_unique" unique ("role_id");`);
  }

}
