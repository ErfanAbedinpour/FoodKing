import { Product } from "@models/product.model";
import { ProductPersist } from "./persistance/product";

export abstract class ProductRepository{
    abstract create(product:ProductPersist):Promise<Product>

    abstract findById(id:number):Promise<Product>

    abstract findBySlug(slug:string):Promise<Product>

    abstract delete(id:number):Promise<Product>

    abstract update(id:number,data:Partial<Omit<ProductPersist,"user_id">>):Promise<Product>

}