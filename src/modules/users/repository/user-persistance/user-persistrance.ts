import { UserRole } from "@models/role.model";

export class UserPersist {
    phone_number: string
    role: UserRole
    email: string
    password: string
    name: string
}