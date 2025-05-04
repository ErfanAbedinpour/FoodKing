import { Test } from '@nestjs/testing';
import { CreateUserHandler as CreateUserUseCase } from '../create-user.handler';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessage } from '../../../../../ErrorMessages/Error.enum';
import { UserService } from '../../../../users/user.service';
import { userService } from './mocks/user-service.mock';
import { User } from '../../../../../models';
describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    createUserUseCase = moduleRef.get(CreateUserUseCase);
  });

  it('Should be defined', () => {
    expect(createUserUseCase).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should throw BadRequest because Phone is exist before', async () => {
    jest
      .spyOn(userService, 'findByPhone')
      .mockResolvedValueOnce({} as unknown as User);

    const promise = createUserUseCase.execute({
      email: 'test-email',
      name: 'test-name',
      password: 'test-pass',
      phone: 'test-phone',
    });
    expect(promise).rejects.toThrow(BadRequestException);
    expect(promise).rejects.toThrow(ErrorMessage.PHONE_EXIST);
    expect(userService.findByPhone).toHaveBeenCalled();
  });

  it('Should be register user successful', async () => {
    const input = {
      email: 'test-email',
      name: 'test-name',
      password: 'test-pass',
      phone_number: 'test-phone',
    };
    jest.spyOn(userService, 'findByPhone').mockResolvedValueOnce(null);
    jest.spyOn(userService, 'createUser').mockResolvedValueOnce();

    const result = await createUserUseCase.execute({
      ...input,
      phone: input.phone_number,
    });

    expect(result).toBe(undefined);
    expect(userService.createUser).toHaveBeenCalledWith(input);
    expect(userService.findByPhone).toHaveBeenCalledWith('test-phone');
  });
});
