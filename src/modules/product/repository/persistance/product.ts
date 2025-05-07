import Decimal from "decimal.js"

export class ProductPersist{
    name:string

    description:string

    slug:string

    inventory:number

    user_id:number

    price:Decimal

    categories:number[]

    restaurant_id:number

    is_active?:boolean
}