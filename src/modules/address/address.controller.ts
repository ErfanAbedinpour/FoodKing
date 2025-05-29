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
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../common/decorator/getUser.decorator';
import { AddressDto } from './dto/address.dto';

@Controller('addresses')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @ApiBody({ type: CreateAddressDto })
  @ApiCreatedResponse({ type: AddressDto })
  @ApiOperation({ summary: "Create new Address" })
  async createAddress(
    @GetUser("userId") userId: number,
    @Body() createAddressDto: CreateAddressDto
  ): Promise<Address> {
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  @ApiOkResponse({ type: [AddressDto] })
  @ApiOperation({ summary: "Get All Addresses" })
  async addresses(@GetUser("userId") userId: number): Promise<Address[]> {
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: AddressDto })
  @ApiParam({ name: "id", description: "AddressId" })
  @ApiOperation({ summary: "Get Address By Id" })
  @ApiNotFoundResponse({ description: "Address Not Found" })
  async address(@Param('id', ParseIntPipe) id: number,
    @GetUser("userId") userId: number
  ): Promise<Address> {
    return this.addressService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AddressDto })
  @ApiParam({ name: "id", description: "AddressId" })
  async updateAddress(
    @GetUser("userId") userId: number,
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.update(userId, id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: "id", description: "AddressId" })
  async removeAddress(@Param('id', ParseIntPipe) id: number,
    @GetUser("userId") userId: number
  ): Promise<boolean> {

    await this.addressService.remove(userId, id);
    return true;
  }
}
