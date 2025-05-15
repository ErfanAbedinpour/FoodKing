import { Test } from "@nestjs/testing"
import { RestaurantRepository } from "../respository/abstract/restaurant.repository"
import { RestaurantService } from "../restaurant.service"
import { Restaurant } from "../../../models"
import { RepositoryException } from "../../../exception/repository.exception"
import { InternalServerErrorException, NotFoundException } from "@nestjs/common"

describe("RestaurantService",()=>{
    let service:RestaurantService

    let repository = {
        create:jest.fn(),
        delete:jest.fn(),
        findAll:jest.fn(),
        findOne:jest.fn(),
        getAllRestaurantProducts:jest.fn(),
        getRestaurantProducts:jest.fn(),
        update:jest.fn()
    } as jest.Mocked<RestaurantRepository> 

    beforeEach(async ()=>{

        const moduleRef = await Test.createTestingModule({

            providers:[
                RestaurantService,
               {
                provide:RestaurantRepository,
                useValue:repository
               } 
            ],}).compile()



            service = moduleRef.get(RestaurantService);
            repository= moduleRef.get(RestaurantRepository);
    })


    it("Should be Defined",()=>{
        expect(service).toBeDefined()
        expect(repository).toBeDefined()
    })

    describe("Create Restaurant",()=>{
        const mockRestaurantData = {
            en_name:"test-restaurant",
            name:"test",
            id:1,
        } as Restaurant


        it("Should Created Restaurant",async ()=>{
            repository.create.mockResolvedValue(mockRestaurantData);

            const result = await service.create({en_name:mockRestaurantData.en_name,name:mockRestaurantData.name},1);
            expect(result.name).toEqual(mockRestaurantData.name)
            expect(result.id).toEqual(1)
            expect(repository.create).toHaveBeenCalledWith({name:mockRestaurantData.name,en_name:mockRestaurantData.en_name,owner_id:1});
        })
    })

    describe("Find All Restaurants", () => {
        const mockRestaurants = [
            {
                id: 1,
                name: "Test Restaurant 1",
                en_name: "test-restaurant-1"
            },
            {
                id: 2, 
                name: "Test Restaurant 2",
                en_name: "test-restaurant-2"
            }
        ] as Restaurant[];

        it("Should return all restaurants", async () => {
            repository.findAll.mockResolvedValue(mockRestaurants);

            const result = await service.findAll();

            expect(result).toEqual(mockRestaurants);
            expect(repository.findAll).toHaveBeenCalled();
        });
    });

    describe("Find One Restaurant", () => {
        const mockRestaurant = {
            id: 1,
            name: "Test Restaurant",
            en_name: "test-restaurant"
        } as Restaurant;

        it("Should return a single restaurant", async () => {
            repository.findOne.mockResolvedValue(mockRestaurant);

            const result = await service.findOne(1);

            expect(result).toEqual(mockRestaurant);
            expect(repository.findOne).toHaveBeenCalledWith(1);
        });

        it("Should throw NotFoundException when restaurant not found", async () => {
            repository.findOne.mockRejectedValue(new RepositoryException("Restaurant not found"));

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });

        it("Should throw InternalServerErrorException on other errors", async () => {
            repository.findOne.mockRejectedValue(new Error());

            await expect(service.findOne(1)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe("Update Restaurant", () => {
        const mockRestaurant = {
            id: 1,
            name: "Test Restaurant",
            en_name: "test-restaurant"
        } as Restaurant;

        const updateDto = {
            name: "Updated Restaurant",
            en_name: "updated-restaurant"
        };

        it("Should update a restaurant successfully", async () => {
            const updatedRestaurant = {
                ...mockRestaurant,
                ...updateDto
            };
            repository.update.mockResolvedValue(updatedRestaurant);

            const result = await service.update(1, updateDto);

            expect(result).toEqual(updatedRestaurant);
            expect(repository.update).toHaveBeenCalledWith(1, updateDto);
        });

        it("Should throw NotFoundException when restaurant not found", async () => {
            repository.update.mockRejectedValue(new RepositoryException("Restaurant not found"));

            await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
        });

        it("Should throw InternalServerErrorException on other errors", async () => {
            repository.update.mockRejectedValue(new Error());

            await expect(service.update(1, updateDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe("Delete Restaurant", () => {
        const mockRestaurant = {
            id: 1,
            name: "Test Restaurant",
            en_name: "test-restaurant"
        } as Restaurant;

        it("Should delete a restaurant successfully", async () => {
            repository.delete.mockResolvedValue(mockRestaurant);

            await service.remove(1);

            expect(repository.delete).toHaveBeenCalledWith(1);
        });

        it("Should throw NotFoundException when restaurant not found", async () => {
            repository.delete.mockRejectedValue(new RepositoryException("Restaurant not found"));

            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });

        it("Should throw InternalServerErrorException on other errors", async () => {
            repository.delete.mockRejectedValue(new Error());

            await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
    });

})