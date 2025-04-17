import { UserRepository } from "../../../../../users/domain/repository/user.repository";

export let userRepository: UserRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByPhone: jest.fn()
}