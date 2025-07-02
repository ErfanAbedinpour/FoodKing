import { Test } from "@nestjs/testing";
import { CommentService } from "../comment.service";
import { ProductService } from "../../product/product.service";
import { EntityManager, NotFoundError } from "@mikro-orm/core";
import { Product } from "@models/product.model";
import { Comment } from "@models/comment.model";
import { User } from "@models/user.model";
import { ErrorMessage } from "@errors";

describe("CommentService", () => {
	let service: CommentService;
	const mockProductService: Partial<jest.Mocked<ProductService>> = {
		getProductById: jest.fn()
	};

	const mockEntityManager: Partial<jest.Mocked<EntityManager>> = {
		create: jest.fn(),
		persistAndFlush: jest.fn(),
		flush: jest.fn(),
		findOneOrFail: jest.fn(),
	};


	beforeEach(async () => {

		const moduelRef = await Test.createTestingModule({
			providers: [
				CommentService,
				{
					provide: ProductService,
					useValue: mockProductService
				},
				{
					provide: EntityManager,
					useValue: mockEntityManager
				}
			]

		}).compile();
		service = moduelRef.get(CommentService);
	})


	it("Should be Defined", () => {
		expect(service).toBeDefined()
	})


	const fakeComment: Comment = Object.freeze({
		id: 4,
		body: "test body",
		rating: 3,
		user: { id: 5 } as User,
		product: { id: 1 } as Product,
		createdAt: Date.now(),
		updatedAt: Date.now()
	})

	it("should be successfull to Create a comment", async () => {


		mockProductService.getProductById?.mockResolvedValueOnce({ id: 1 } as Product);
		mockEntityManager.create?.mockReturnValueOnce({ ...fakeComment } as never)
		mockEntityManager.persistAndFlush?.mockResolvedValueOnce();

		const result = await service.createComment(1, { body: "test body", productId: 1, rate: 5 })


		expect(result).toEqual({
			body: fakeComment.body,
			rating: fakeComment.rating,
			createdAt: fakeComment.createdAt!.toString(),
			updatedAt: fakeComment.updatedAt!.toString(),
			productId: fakeComment.product.id,
			userId: fakeComment.user.id,
			id: fakeComment.id
		});

		expect(mockProductService.getProductById).toHaveBeenCalledWith(1);

		expect(mockEntityManager.create).toHaveBeenCalledWith(Comment, { body: "test body", rating: 5, product: 1, user: 1 })
	})



	it("should be throw not found if commnet does not found", () => {

		mockEntityManager.findOneOrFail?.mockRejectedValueOnce(new NotFoundError(""))
		expect(service.updateComment(1, { rate: 3 }, 2)).rejects.toThrow(ErrorMessage.COMMENT_NOT_FOUND)

		expect(mockEntityManager.findOneOrFail).toHaveBeenCalledWith(
			Comment,
			{
				$and: [{ id: 1 }, { user: 2 }]

			}

		)
	})
})
