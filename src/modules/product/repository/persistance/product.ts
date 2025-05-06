import Decimal from "decimal.js"

export class ProductPersist{
    name:string

    description:string

    slug:string

    inventory:number

    user_id:number

    price:Decimal

    category_ids:number[]

    restaurant_id:number
}