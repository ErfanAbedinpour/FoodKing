import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "../category.service";
import { CategoryRepository } from "../repository/category.repository";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { RepositoryException } from "../../../exception/repository.exception";

describe("Category Service", () => {
    const fakeCategory = {
        id:1,
        name: "Test Category",
        en_name: "Test Category",
        slug: "test-category",
    }

    let service: CategoryService;
    const mockCategoryRepository = {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByName: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryService,
                {
                    provide: CategoryRepository,
                    useValue: mockCategoryRepository,
                },
            ],
            
        }).compile();

        service = module.get<CategoryService>(CategoryService);

    });

  it("should be defined", () => {
    expect(service).toBeDefined(); 
  });


  describe("Create Category", () => {
    const createCategoryDto: CreateCategoryDto = {
            name: "Test Category",
            en_name: "Test Category",
            slug: "test-category",
    };

    it("should create a category", async () => {
        mockCategoryRepository.create.mockResolvedValue({
            ...createCategoryDto,
            id:1,
        });
        const category = await service.create(createCategoryDto,1);
        expect(category.id).toEqual(1);
        expect(category.name).toEqual(createCategoryDto.name);
        expect(category.en_name).toEqual(createCategoryDto.en_name);
        expect(category.slug).toEqual(createCategoryDto.slug);
    });

    it("should throw an error if the category already exists", async () => {

        mockCategoryRepository.create.mockRejectedValueOnce(
            new UniqueConstraintViolationException({message:"message",name:"name",cause:"cause",stack:"stack"}) 
        );

        expect(service.create(createCategoryDto,1)).rejects.toThrow(BadRequestException);
    });
  });
  
    


  describe("Find All Categories", () => {   
    it("should return all categories", async () => {
        mockCategoryRepository.findAll.mockResolvedValue(
        [
            {
                ...fakeCategory,
            },
            {
                ...fakeCategory,
                id:2,
                slug: "test-category-2",
            },
            {
                ...fakeCategory,
                id:3,
                slug: "test-category-3",
            },
        ]);

        const categories = await service.findAll();
        expect(categories.length).toEqual(3);
        expect(categories[0].id).toEqual(1);
        expect(categories[1].id).toEqual(2);
        expect(categories[2].id).toEqual(3);
    });
  });

  describe("Find Category By Id", () => {
    it("should return a category by id", async () => {
        mockCategoryRepository.findById.mockResolvedValue(fakeCategory);

        const category = await service.findOne("1");
        expect(category.id).toEqual(1);
        expect(category.name).toEqual(fakeCategory.name);
        expect(category.en_name).toEqual(fakeCategory.en_name);
        expect(category.slug).toEqual(fakeCategory.slug);
    });

    it("should throw an error if the category is not found", async () => {
        mockCategoryRepository.findById.mockRejectedValueOnce(new RepositoryException(""));
        expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("Update Category", () => {
    it("should update a category", async () => {
        mockCategoryRepository.update.mockResolvedValue({...fakeCategory,slug:"new-slug"});
        const category = await service.update("1",{slug:"new-slug"});
        expect(category.id).toEqual(1);
        expect(category.slug).toEqual("new-slug");
    });

    it("should throw an error if the category is not found", async () => {
        mockCategoryRepository.update.mockRejectedValueOnce(new RepositoryException(""));
        expect(service.update("1",{slug:"new-slug"})).rejects.toThrow(NotFoundException);
    });
    
  });


  describe("Delete Category", () => {
    it("should delete a category", async () => {
        mockCategoryRepository.delete.mockResolvedValue(true);
        const result = await service.remove("1");
        expect(result.msg).toEqual("Removed successfully");
    });

    it("should throw an error if the category is not found", async () => {
        mockCategoryRepository.delete.mockRejectedValueOnce(new RepositoryException(""));
        expect(service.remove("1")).rejects.toThrow(NotFoundException);
    });
  });
});
