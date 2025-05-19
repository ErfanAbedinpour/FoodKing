import { Migration } from '@mikro-orm/migrations';

export class Migration20250519180430 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "products" add column "image" varchar(255) null;`);
    this.addSql(`alter table "products" add constraint "products_image_unique" unique ("image");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products" drop constraint "products_image_unique";`);
    this.addSql(`alter table "products" drop column "image";`);
  }

}
