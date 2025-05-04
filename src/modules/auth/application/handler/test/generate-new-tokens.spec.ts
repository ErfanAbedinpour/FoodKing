import { Test } from '@nestjs/testing';
import { GenerateNewTokensHandler } from '../generate-new-tokens.handler';
import { UserSessionRepository } from '../../../repository/abstract/user-session.repository';
import { userSessionRepository } from './mocks/user-session-repository.mock';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { UserService } from '../../../../users/user.service';
import { userService } from './mocks/user-service.mock';
import { GenerateNewTokensCommand } from '../../command/generate-new-tokens.command';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ErrorMessage } from '../../../../../ErrorMessages/Error.enum';
import { User } from '../../../../../models';

describe('CreateUserUseCase', () => {
  let generateNewTokensHandler: GenerateNewTokensHandler;

  let jwtServiceMock = {
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  let commandBusMock = {
    execute: jest.fn(),
  } as unknown as CommandBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GenerateNewTokensHandler,
        {
          provide: UserSessionRepository,
          useValue: userSessionRepository,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: CommandBus,
          useValue: commandBusMock,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();
    generateNewTokensHandler = moduleRef.get(GenerateNewTokensHandler);
  });

  it('Should be defined', () => {
    expect(generateNewTokensHandler).toBeDefined();
    expect(jwtServiceMock).toBeDefined();
    expect(commandBusMock).toBeDefined();
  });

  it('Should be Unauthorized because Token is invalid', async () => {
    jest
      .spyOn(jwtServiceMock, 'verifyAsync')
      .mockRejectedValue(new JsonWebTokenError('error'));
    try {
      const res = await generateNewTokensHandler.execute({
        refreshToken: 'fake-token',
      } as GenerateNewTokensCommand);
      expect(res).toThrow(UnauthorizedException);
      expect(res).toThrow(ErrorMessage.INVALID_REFRESH_TOKEN);
    } catch (err) {
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalled();
    }
  });

  it('Should be Unauthorized because Token is valid but invalidated IN DB', async () => {
    jest
      .spyOn(jwtServiceMock, 'verifyAsync')
      .mockResolvedValue({ tokenId: 'token-id' });
    jest.spyOn(userSessionRepository, 'isValidate').mockResolvedValue(false);

    try {
      const res = await generateNewTokensHandler.execute({
        refreshToken: 'valid-token',
      } as GenerateNewTokensCommand);
      expect(res).toThrow(UnauthorizedException);
      expect(res).toThrow(ErrorMessage.INVALID_REFRESH_TOKEN);
    } catch (err) {
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalled();
      expect(userSessionRepository.isValidate).toHaveBeenCalledWith('token-id');
    }
  });

  it('should be Throw BadRequest if User Not Found', async () => {
    jest
      .spyOn(jwtServiceMock, 'verifyAsync')
      .mockResolvedValue({ tokenId: 'token-id', userId: 1 });
    jest.spyOn(userSessionRepository, 'isValidate').mockResolvedValue(true);
    jest.spyOn(userService, 'findById').mockResolvedValue(null);

    try {
      const res = await generateNewTokensHandler.execute({
        refreshToken: 'valid-token',
      } as GenerateNewTokensCommand);
      expect(res).toThrow(BadRequestException);
      expect(res).toThrow(ErrorMessage.USER_NOT_FOUND);
    } catch (err) {
      expect(userService.findById).toHaveBeenCalledWith(1);
      expect(userSessionRepository.isValidate).toHaveBeenCalledWith('token-id');
      expect(userSessionRepository.invalidate).toHaveBeenCalledWith('token-id');
    }
  });

  it('Should be return execute Successfully', async () => {
    jest
      .spyOn(jwtServiceMock, 'verifyAsync')
      .mockResolvedValue({ tokenId: 'token-id', userId: 1 });
    jest.spyOn(userSessionRepository, 'isValidate').mockResolvedValue(true);
    jest
      .spyOn(userService, 'findById')
      .mockResolvedValue({
        id: 1,
        name: 'test-name',
        role: { name: 'Customer' },
      } as User);
    jest
      .spyOn(commandBusMock, 'execute')
      .mockResolvedValueOnce({
        accessToken: 'access',
        refreshToken: 'refresh',
      });

    const res = await generateNewTokensHandler.execute({
      refreshToken: 'valid-token',
    } as GenerateNewTokensCommand);
    expect(res).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    expect(commandBusMock.execute).toHaveBeenCalledWith({
      userId: 1,
      name: 'test-name',
      role: 'Customer',
    });
    expect(userService.findById).toHaveBeenCalledWith(1);
    expect(userSessionRepository.isValidate).toHaveBeenCalledWith('token-id');
    expect(userSessionRepository.invalidate).toHaveBeenCalledWith('token-id');
  });
});
