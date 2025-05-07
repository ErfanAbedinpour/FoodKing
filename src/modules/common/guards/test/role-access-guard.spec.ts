import { Test } from '@nestjs/testing';
import { RoleAccessGuard } from '../role-access.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@models/index';
import { ErrorMessage } from '@errors';
import { Reflector } from '@nestjs/core';

describe('JWT Verification Guard', () => {
  let guard: RoleAccessGuard;

  let mockReflector = {
    getAll: jest.fn(),
  } as unknown as Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoleAccessGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = moduleRef.get(RoleAccessGuard);
  });
  const mockCtx = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { role: UserRole.Customer } }),
    }),
  } as unknown as ExecutionContext;

  it('Should be defined', () => {
    expect(guard).toBeDefined();
    expect(mockReflector).toBeDefined();
  });

  it('Should be return true if no role was set', async () => {
    jest.spyOn(mockReflector, 'getAll').mockReturnValueOnce(undefined as never);
    expect(await guard.canActivate(mockCtx)).toEqual(true);
  });

  it('Should be Throw Forbidden if role is Invalid', () => {
    jest
      .spyOn(mockReflector, 'getAll')
      .mockReturnValue([UserRole.Manager] as never);

    const res = guard.canActivate(mockCtx);
    expect(res).rejects.toThrow(ForbiddenException);
    expect(res).rejects.toThrow(ErrorMessage.INVALID_ACCESS);
  });

  it('Should be true', async () => {
    jest
      .spyOn(mockReflector, 'getAll')
      .mockReturnValue([UserRole.Customer] as never);

    const res = await guard.canActivate(mockCtx);
    expect(res).toEqual(true);
  });
});
