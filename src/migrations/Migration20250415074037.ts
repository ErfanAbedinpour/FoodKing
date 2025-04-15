import { Migration } from '@mikro-orm/migrations';

export class Migration20250415074037 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "attribute" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(255) not null);`);
    this.addSql(`alter table "attribute" add constraint "attribute_name_unique" unique ("name");`);

    this.addSql(`create table "Restaurant" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(255) not null, "en_name" varchar(255) not null);`);

    this.addSql(`create table "Role" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" text check ("name" in ('')) not null default 'Customer');`);
    this.addSql(`alter table "Role" add constraint "Role_name_unique" unique ("name");`);

    this.addSql(`create table "User" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role_id" int not null, "phone_number" varchar(255) not null, "is_active" boolean not null);`);
    this.addSql(`alter table "User" add constraint "User_email_unique" unique ("email");`);
    this.addSql(`alter table "User" add constraint "User_role_id_unique" unique ("role_id");`);
    this.addSql(`alter table "User" add constraint "User_phone_number_unique" unique ("phone_number");`);

    this.addSql(`create table "session" ("id" serial primary key, "token" varchar(255) not null, "user_id" int not null, "created_at" bigint not null);`);

    this.addSql(`create table "categoryies" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "slug" varchar(50) not null, "name" varchar(255) not null, "en_name" varchar(255) not null, "is_activate" boolean not null default true, "user_id" int not null);`);
    this.addSql(`alter table "categoryies" add constraint "categoryies_slug_unique" unique ("slug");`);

    this.addSql(`create table "products" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(50) not null, "description" text not null, "slug" varchar(255) not null, "inventory" int not null, "user_id" int not null, "price" numeric(10,2) not null, "category_id" int not null, "restaurant_id" int not null, "is_active" boolean not null default true);`);
    this.addSql(`alter table "products" add constraint "products_slug_unique" unique ("slug");`);

    this.addSql(`create table "productAttributes" ("product_id" int not null, "attribute_id" int not null, "value" varchar(255) not null, constraint "productAttributes_pkey" primary key ("product_id", "attribute_id"));`);

    this.addSql(`create table "comments" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "body" text not null, "rating" int not null, "user_id" int not null, "product_id" int not null);`);

    this.addSql(`create table "carts" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "user_id" int not null);`);
    this.addSql(`alter table "carts" add constraint "carts_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "cart_product" ("product_id" int not null, "cart_id" int not null, "count" int not null, constraint "cart_product_pkey" primary key ("product_id", "cart_id"));`);

    this.addSql(`create table "Address" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "postal_code" varchar(255) not null, "street" text not null, "province" varchar(255) not null, "latitude" int not null, "longitude" int not null, "user_id" int not null);`);

    this.addSql(`create table "orders" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "status" text check ("status" in ('processing', 'Shipped', 'Delivered')) not null default 'processing', "user_id" int not null, "address_id" int not null, "payment_method" varchar(255) not null, "total_price" numeric(10,0) not null);`);

    this.addSql(`create table "payments" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "amount" numeric(10,2) not null, "provider" text check ("provider" in ('zarinpal', 'zipal')) not null, "authority" varchar(255) not null, "status" text check ("status" in ('Pending', 'Success', 'Failed')) not null default 'Pending', "transaction_id" varchar(255) null, "user_id" int not null, "order_id" int not null);`);
    this.addSql(`alter table "payments" add constraint "payments_order_id_unique" unique ("order_id");`);

    this.addSql(`create table "order-items" ("order_id" int not null, "product_id" int not null, "quantity" int not null, "price" numeric(10,2) not null, constraint "order-items_pkey" primary key ("order_id", "product_id"));`);

    this.addSql(`alter table "User" add constraint "User_role_id_foreign" foreign key ("role_id") references "Role" ("id") on update cascade on delete set default;`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "categoryies" add constraint "categoryies_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade;`);

    this.addSql(`alter table "products" add constraint "products_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "products" add constraint "products_category_id_foreign" foreign key ("category_id") references "categoryies" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "products" add constraint "products_restaurant_id_foreign" foreign key ("restaurant_id") references "Restaurant" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "productAttributes" add constraint "productAttributes_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "productAttributes" add constraint "productAttributes_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "comments" add constraint "comments_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade;`);
    this.addSql(`alter table "comments" add constraint "comments_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "carts" add constraint "carts_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cart_product" add constraint "cart_product_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "cart_product" add constraint "cart_product_cart_id_foreign" foreign key ("cart_id") references "carts" ("id") on update cascade;`);

    this.addSql(`alter table "Address" add constraint "Address_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade;`);

    this.addSql(`alter table "orders" add constraint "orders_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "orders" add constraint "orders_address_id_foreign" foreign key ("address_id") references "Address" ("id") on update cascade;`);

    this.addSql(`alter table "payments" add constraint "payments_user_id_foreign" foreign key ("user_id") references "User" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "payments" add constraint "payments_order_id_foreign" foreign key ("order_id") references "orders" ("id") on update cascade;`);

    this.addSql(`alter table "order-items" add constraint "order-items_order_id_foreign" foreign key ("order_id") references "orders" ("id") on update cascade;`);
    this.addSql(`alter table "order-items" add constraint "order-items_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "productAttributes" drop constraint "productAttributes_attribute_id_foreign";`);

    this.addSql(`alter table "products" drop constraint "products_restaurant_id_foreign";`);

    this.addSql(`alter table "User" drop constraint "User_role_id_foreign";`);

    this.addSql(`alter table "session" drop constraint "session_user_id_foreign";`);

    this.addSql(`alter table "categoryies" drop constraint "categoryies_user_id_foreign";`);

    this.addSql(`alter table "products" drop constraint "products_user_id_foreign";`);

    this.addSql(`alter table "comments" drop constraint "comments_user_id_foreign";`);

    this.addSql(`alter table "carts" drop constraint "carts_user_id_foreign";`);

    this.addSql(`alter table "Address" drop constraint "Address_user_id_foreign";`);

    this.addSql(`alter table "orders" drop constraint "orders_user_id_foreign";`);

    this.addSql(`alter table "payments" drop constraint "payments_user_id_foreign";`);

    this.addSql(`alter table "products" drop constraint "products_category_id_foreign";`);

    this.addSql(`alter table "productAttributes" drop constraint "productAttributes_product_id_foreign";`);

    this.addSql(`alter table "comments" drop constraint "comments_product_id_foreign";`);

    this.addSql(`alter table "cart_product" drop constraint "cart_product_product_id_foreign";`);

    this.addSql(`alter table "order-items" drop constraint "order-items_product_id_foreign";`);

    this.addSql(`alter table "cart_product" drop constraint "cart_product_cart_id_foreign";`);

    this.addSql(`alter table "orders" drop constraint "orders_address_id_foreign";`);

    this.addSql(`alter table "payments" drop constraint "payments_order_id_foreign";`);

    this.addSql(`alter table "order-items" drop constraint "order-items_order_id_foreign";`);

    this.addSql(`drop table if exists "attribute" cascade;`);

    this.addSql(`drop table if exists "Restaurant" cascade;`);

    this.addSql(`drop table if exists "Role" cascade;`);

    this.addSql(`drop table if exists "User" cascade;`);

    this.addSql(`drop table if exists "session" cascade;`);

    this.addSql(`drop table if exists "categoryies" cascade;`);

    this.addSql(`drop table if exists "products" cascade;`);

    this.addSql(`drop table if exists "productAttributes" cascade;`);

    this.addSql(`drop table if exists "comments" cascade;`);

    this.addSql(`drop table if exists "carts" cascade;`);

    this.addSql(`drop table if exists "cart_product" cascade;`);

    this.addSql(`drop table if exists "Address" cascade;`);

    this.addSql(`drop table if exists "orders" cascade;`);

    this.addSql(`drop table if exists "payments" cascade;`);

    this.addSql(`drop table if exists "order-items" cascade;`);
  }

}
