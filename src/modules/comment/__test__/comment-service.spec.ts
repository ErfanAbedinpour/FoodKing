import { Test } from "@nestjs/testing"
import { CommentService } from "../comment.service";
import { ProductService } from "../../product/product.service";
import { EntityManager } from "@mikro-orm/core";

describe("CommentService",()=>{
	let service:CommentService;
	const mockProductService:Partial<jest.Mocked<ProductService>> = {
		getProductById:jest.fn()
	} ;

	const mockEntityManager = {}
	beforeEach(async ()=>{

		const moduelRef = await Test.createTestingModule({
			providers:[
				CommentService,
				{
					provide:ProductService,
					useValue:mockProductService
				},
				{
					provide:EntityManager,
					useValue:mockEntityManager
				}
				]

		}).compile();
		service = moduelRef.get(CommentService);

	})


	it("Should be Defined",()=>{
		expect(service).toBeDefined()
	})
})
