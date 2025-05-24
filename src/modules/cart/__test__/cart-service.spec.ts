import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { CartRepository } from '../repository/cart.repository';
import { ProductService } from '../../product/product.service';
import { Cart, CartProduct, Product } from '../../../models';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';

describe('Cart Service', () => {
  let cartService: CartService;

  let mockCartRepository: jest.Mocked<CartRepository> = {
    getCartWithItems: jest.fn(),
    getCartByUserId: jest.fn(),
    addItemToCart: jest.fn(),
    removeItemFromCart: jest.fn(),
    clearCart: jest.fn(),
    updateItemCount: jest.fn(),
    createCart: jest.fn(),
    getItemFromCart: jest.fn(),
  };

  let mockProductService = {
    getProductById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartRepository,
          useValue: mockCartRepository,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(cartService).toBeDefined();
  });

  describe('Add Item To Cart', () => {
    const mockProduct = {
      id: 1,
      name: 'Product 1',
      price: 100,
      inventory: 10,
    };

    it('a new Item Should be added to cart', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);
      mockProductService.getProductById.mockResolvedValue(mockProduct);
      mockCartRepository.getItemFromCart.mockResolvedValue(null);
      mockCartRepository.addItemToCart.mockResolvedValue({
        cart: { id: 1 },
        product: mockProduct as unknown as Product,
        count: 1,
      } as CartProduct);
      const cart = await cartService.addItemToCart(1, { productId: 1 });
      expect(cart).toBeDefined();
      expect(cart.cartId).toBe(1);
      expect(cart.product.id).toBe(1);
      expect(cart.count).toBe(1);
      expect(mockCartRepository.addItemToCart).toHaveBeenCalledWith(
        1,
        mockProduct,
      );

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
      expect(mockCartRepository.getCartByUserId).toHaveBeenCalledWith(1);
    });

    it('should throw error if product is out of stock', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);
      mockProductService.getProductById.mockResolvedValue({
        ...mockProduct,
        inventory: 0,
      });

      expect(cartService.addItemToCart(1, { productId: 1 })).rejects.toThrow(
        BadRequestException,
      );
      expect(cartService.addItemToCart(1, { productId: 1 })).rejects.toThrow(
        ErrorMessage.PRODUCT_OUT_OF_STOCK,
      );
    });

    it('should throw error if product is not found', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);
      mockProductService.getProductById.mockRejectedValue(
        new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND),
      );

      expect(cartService.addItemToCart(1, { productId: 1 })).rejects.toThrow(
        NotFoundException,
      );
      expect(cartService.addItemToCart(1, { productId: 1 })).rejects.toThrow(
        ErrorMessage.PRODUCT_NOT_FOUND,
      );
    });

    it('should be updated if item is already in cart', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);
      mockProductService.getProductById.mockResolvedValue(mockProduct);
      mockCartRepository.getItemFromCart.mockResolvedValue({
        cart: { id: 1 },
        product: mockProduct as unknown as Product,
        count: 1,
      } as CartProduct);
      mockCartRepository.updateItemCount.mockResolvedValue({
        cart: { id: 1 },
        product: mockProduct as unknown as Product,
        count: 2,
      } as CartProduct);

      const cart = await cartService.addItemToCart(1, { productId: 1 });
      expect(cart).toBeDefined();
      expect(cart.cartId).toBe(1);
      expect(cart.product.id).toBe(1);
      expect(cart.count).toBe(2);
      expect(mockCartRepository.updateItemCount).toHaveBeenCalledWith(1, 1, 2);
      expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
      expect(mockCartRepository.getCartByUserId).toHaveBeenCalledWith(1);
    });

    it('Should be throw error if updated count is greater than product inventory', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);

      mockProductService.getProductById.mockResolvedValue({
        ...mockProduct,
        inventory: 1,
      });

      mockCartRepository.getItemFromCart.mockResolvedValue({
        cart: { id: 1 },
        product: mockProduct as unknown as Product,
        count: 1,
      } as CartProduct);

      expect(cartService.addItemToCart(1, { productId: 1 })).rejects.toThrow(
        BadRequestException,
      );
      expect(cartService.addItemToCart(1, { productId: 1 })).rejects.toThrow(
        ErrorMessage.PRODUCT_OUT_OF_STOCK,
      );
    });
  });

  describe('Remove Item From Cart', () => {
    const mockProduct = {
      id: 1,
      name: 'Product 1',
      price: 100,
      inventory: 10,
    };

    it('should remove item from cart', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);
      mockProductService.getProductById.mockResolvedValue(mockProduct);
      mockCartRepository.getItemFromCart.mockResolvedValue({
        cart: { id: 1 },
        product: mockProduct as unknown as Product,
        count: 1,
      } as CartProduct);
      mockCartRepository.removeItemFromCart.mockResolvedValue({
        cart: { id: 1 },
        product: mockProduct as unknown as Product,
        count: 0,
      } as CartProduct);

      const result = await cartService.removeItemFromCart(1, 1);
      expect(result).toBeDefined();
      expect(result.msg).toBe('Cart updated successfully');
      expect(mockCartRepository.removeItemFromCart).toHaveBeenCalledWith(1, 1);
    });

    it('should throw error if cartItem is not found', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);
      mockProductService.getProductById.mockResolvedValue(mockProduct);
      mockCartRepository.getItemFromCart.mockResolvedValue(null);

      expect(cartService.removeItemFromCart(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(cartService.removeItemFromCart(1, 1)).rejects.toThrow(
        ErrorMessage.CART_ITEM_NOT_FOUND,
      );
    });

    it('should throw error if product is not found', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);

      mockCartRepository.getItemFromCart.mockResolvedValue({
        cart: { id: 1 },
        product: mockProduct as unknown as Product,
        count: 1,
      } as CartProduct);

      mockProductService.getProductById.mockRejectedValue(
        new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND),
      );

      expect(cartService.removeItemFromCart(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(cartService.removeItemFromCart(1, 1)).rejects.toThrow(
        ErrorMessage.PRODUCT_NOT_FOUND,
      );
    });
  });

  describe('Clear Cart', () => {
    it('should clear cart', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue({ id: 1 } as Cart);
      mockCartRepository.clearCart.mockResolvedValue();

      const result = await cartService.clearCart(1);
      expect(result).toBeDefined();
      expect(result.msg).toBe('Cart cleared');
      expect(mockCartRepository.clearCart).toHaveBeenCalledWith(1);
    });

    it('should throw error if cart is not found', async () => {
      mockCartRepository.getCartByUserId.mockResolvedValue(null);

      expect(cartService.clearCart(1)).rejects.toThrow(NotFoundException);
      expect(cartService.clearCart(1)).rejects.toThrow(
        ErrorMessage.CART_NOT_FOUND,
      );
    });
  });
});
