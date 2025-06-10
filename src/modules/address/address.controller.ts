import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from '../../models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IsAuth } from '../common/decorator/auth.decorator';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../common/decorator/getUser.decorator';
import { CreateAddressSwagger, GetAllAddressSwagger, GetOneAddressSwagger, RemoveAddressSwagger, UpdateAddressSwagger } from './address.swagger';

@Controller('addresses')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
@ApiUnauthorizedResponse({description:"You should login first."})
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @CreateAddressSwagger()
  async createAddress(
    @GetUser("userId") userId: number,
    @Body() createAddressDto: CreateAddressDto
  ): Promise<Address> {
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  @GetAllAddressSwagger()
  async addresses(@GetUser("userId") userId: number): Promise<Address[]> {
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  @GetOneAddressSwagger()
  async address(@Param('id', ParseIntPipe) id: number,
    @GetUser("userId") userId: number
  ): Promise<Address> {
    return this.addressService.findOne(userId, id);
  }

  @Patch(':id')
  @UpdateAddressSwagger()
  async updateAddress(
    @GetUser("userId") userId: number,
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.update(userId, id, updateAddressDto);
  }

  @Delete(':id')
  @RemoveAddressSwagger()
  async removeAddress(@Param('id', ParseIntPipe) id: number,
    @GetUser("userId") userId: number
  ): Promise<boolean> {

    await this.addressService.remove(userId, id);
    return true;
  }
}
