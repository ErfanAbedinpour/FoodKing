import { Migration } from '@mikro-orm/migrations';

export class Migration20250508162729 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "product-category" drop constraint "product-category_product_id_foreign";`);
    this.addSql(`alter table "product-category" drop constraint "product-category_category_id_foreign";`);

    this.addSql(`alter table "Restaurant" add column "owner_id_id" int not null;`);
    this.addSql(`alter table "Restaurant" add constraint "Restaurant_owner_id_id_foreign" foreign key ("owner_id_id") references "User" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product-category" add constraint "product-category_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "product-category" add constraint "product-category_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "Restaurant" drop constraint "Restaurant_owner_id_id_foreign";`);

    this.addSql(`alter table "product-category" drop constraint "product-category_product_id_foreign";`);
    this.addSql(`alter table "product-category" drop constraint "product-category_category_id_foreign";`);

    this.addSql(`alter table "Restaurant" drop column "owner_id_id";`);

    this.addSql(`alter table "product-category" add constraint "product-category_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "product-category" add constraint "product-category_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade;`);
  }

}
