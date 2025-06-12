import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { OrderRepository } from '../repository/order.repository';
import { AddressService } from '../../address/address.service';
import { ProductService } from '../../product/product.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatus, PaymentMethod } from '../../../models/order.model';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderCreatedEvent } from '../events/order-created.event';
import Decimal from 'decimal.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';
import { RepositoryException } from '../../../exception/repository.exception';

describe("OrderService", () => {
    let service: OrderService;
    const mockOrderRepository = {
        createOrder: jest.fn(),
        getAllUserOrder: jest.fn(),
        getOrderById: jest.fn(),
        cancleOrder: jest.fn(),
        getUserOrderById: jest.fn(),
    }
    const mockAddressService = {
        findOne: jest.fn(),
    }


    const mockProductService = {
        getProductById: jest.fn(),
    }

    const mockEventEmitter = {
        emit: jest.fn(),
    }

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: OrderRepository,
                    useValue: mockOrderRepository,
                },
                {
                    provide: AddressService,
                    useValue: mockAddressService,
                },
                {
                    provide: ProductService,
                    useValue: mockProductService,
                },
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter,
                }
            ],
        }).compile();

        service = moduleRef.get<OrderService>(OrderService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });



    describe("createOrder", () => {
        const createOrderDto: CreateOrderDto = {
            addressId: 1,
            paymentMethod: PaymentMethod.Online,
            products: [{ productId: 1, quantity: 1 }],
        }

        mockOrderRepository.createOrder.mockResolvedValue({
            id: 1,
            status: OrderStatus.Processing,
            paymentMethod: PaymentMethod.Online,
            products: [{ productId: 1, quantity: 1 }],
        });


        it("should create an order", async () => {

            mockAddressService.findOne.mockResolvedValueOnce({});

            mockProductService.getProductById.mockResolvedValue({
                id: 1,
                name: "Product 1",
                price: new Decimal(100),
                inventory: 10,
            });


            const order = await service.createOrder(1, createOrderDto)


            expect(order.orderId).toEqual(1);
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('order.created', new OrderCreatedEvent([{ productId: 1, quantity: 1 }], 1));
            expect(mockAddressService.findOne).toHaveBeenCalledWith(1, 1);
            expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
            expect(mockOrderRepository.createOrder).toHaveBeenCalledWith({
                addressId: 1,
                paymentMethod: PaymentMethod.Online,
                products: [{ productId: 1, quantity: 1, price: new Decimal(100) }],
                userId: 1,
            })
        })

        it("should throw an error if the address is not found", async () => {
            mockAddressService.findOne.mockRejectedValueOnce(new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND));
            expect(service.createOrder(1, createOrderDto)).rejects.toThrow(NotFoundException);
        })

        it("should throw an error if the product is not found", async () => {
            mockAddressService.findOne.mockResolvedValueOnce({});
            mockProductService.getProductById.mockRejectedValueOnce(new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND));
            expect(service.createOrder(1, createOrderDto)).rejects.toThrow(NotFoundException);
        })


        it("should throw an error if the product is out of stock", async () => {
            mockAddressService.findOne.mockResolvedValueOnce({});
            mockProductService.getProductById.mockResolvedValueOnce({
                id: 1,
                name: "Product 1",
                price: new Decimal(100),
                inventory: 0,
            })
            expect(service.createOrder(1, createOrderDto)).rejects.toThrow(ErrorMessage.PRODUCT_OUT_OF_STOCK);
        })
    })



    describe("getOrders", () => {
        it("should return all orders", async () => {
            mockOrderRepository.getAllUserOrder.mockResolvedValueOnce([{
                id: 1,
                status: OrderStatus.Processing,
                paymentMethod: PaymentMethod.Online,
                products: [{ productId: 1, quantity: 1 }],
            }]);

            const orders = await service.getOrders(1);
            expect(orders).toEqual([{
                id: 1,
                status: OrderStatus.Processing,
                paymentMethod: PaymentMethod.Online,
                products: [{ productId: 1, quantity: 1 }],
            }]);
            expect(mockOrderRepository.getAllUserOrder).toHaveBeenCalledWith(1);
        })
    })


    describe("getOrderById", () => {
        it("should return an order", async () => {
            mockOrderRepository.getUserOrderById.mockResolvedValueOnce({
                id: 1,
                status: OrderStatus.Processing,
                paymentMethod: PaymentMethod.Online,
                products: [{ productId: 1, quantity: 1 }],
            });

            const order = await service.getUserOrderById(1, 1);

            expect(order).toEqual({
                id: 1,
                status: OrderStatus.Processing,
                paymentMethod: PaymentMethod.Online,
                products: [{ productId: 1, quantity: 1 }],
            })
            expect(mockOrderRepository.getUserOrderById).toHaveBeenCalledWith(1, 1);
        })


        it("should throw an error if the order is not found", async () => {
            mockOrderRepository.getUserOrderById.mockResolvedValueOnce(null);
            expect(service.getUserOrderById(1, 1)).rejects.toThrow(NotFoundException);
        })
    })


    describe("cancleOrder", () => {
        it("should cancel an order", async () => {
            mockOrderRepository.cancleOrder.mockResolvedValueOnce(null);
            mockOrderRepository.getUserOrderById.mockResolvedValueOnce({
                id: 1,
                status: OrderStatus.Processing,
                paymentMethod: PaymentMethod.Online,
                products: [{ productId: 1, quantity: 1 }],
            });

            await service.cancleOrder(1, 1);
            expect(mockOrderRepository.getUserOrderById).toHaveBeenCalledWith(1, 1);
            expect(mockOrderRepository.cancleOrder).toHaveBeenCalledWith(1);
        })

        it("should throw an error if the order is not found", async () => {
            mockOrderRepository.getUserOrderById.mockResolvedValueOnce(null);
            expect(service.cancleOrder(1, 1)).rejects.toThrow(NotFoundException);
        })

        it("should throw an error if the order is not processing", async () => {
            mockOrderRepository.getUserOrderById.mockResolvedValueOnce({
                id: 1,
                status: OrderStatus.Shipped,
            });
            expect(service.cancleOrder(1, 1)).rejects.toThrow(BadRequestException);
        })
    })
});