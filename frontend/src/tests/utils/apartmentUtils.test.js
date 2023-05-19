import { apartmentFixtures } from "fixtures/apartmentFixtures";
import { apartmentUtils } from "main/utils/apartmentUtils";

describe("apartmentUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "apartments".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "apartments") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When apartments is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.get();

            // assert
            const expected = { nextId: 1, apartments: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("apartments", expectedJSON);
        });

        test("When apartments is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.get();

            // assert
            const expected = { nextId: 1, apartments: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("apartments", expectedJSON);
        });

        test("When apartments is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, apartments: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.get();

            // assert
            const expected = { nextId: 1, apartments: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When apartments is JSON of three apartments, should return that JSON", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;
            const mockApartmentCollection = { nextId: 10, apartments: threeApartments };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockApartmentCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.get();

            // assert
            expect(result).toEqual(mockApartmentCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting an apartment by id works", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;
            const idToGet = threeApartments[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            // act
            const result = apartmentUtils.getById(idToGet);

            // assert

            const expected = { apartment: threeApartments[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing apartment returns an error", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            // act
            const result = apartmentUtils.getById(99);

            // assert
            const expectedError = `apartment with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            // act
            const result = apartmentUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one apartment works", () => {

            // arrange
            const apartment = apartmentFixtures.oneApartment[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, apartments: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.add(apartment);

            // assert
            expect(result).toEqual(apartment);
            expect(setItemSpy).toHaveBeenCalledWith("apartments",
                JSON.stringify({ nextId: 2, apartments: apartmentFixtures.oneApartment }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing apartment works", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;
            const updatedApartment = {
                ...threeApartments[0],
                name: "Updated Name"
            };
            const threeApartmentsUpdated = [
                updatedApartment,
                threeApartments[1],
                threeApartments[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.update(updatedApartment);

            // assert
            const expected = { apartmentCollection: { nextId: 5, apartments: threeApartmentsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("apartments", JSON.stringify(expected.apartmentCollection));
        });
        test("Check that updating an non-existing apartment returns an error", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedApartment = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = apartmentUtils.update(updatedApartment);

            // assert
            const expectedError = `apartment with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting an apartment by id works", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;
            const idToDelete = threeApartments[1].id;
            const threeApartmentsUpdated = [
                threeApartments[0],
                threeApartments[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.del(idToDelete);

            // assert

            const expected = { apartmentCollection: { nextId: 5, apartments: threeApartmentsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("apartments", JSON.stringify(expected.apartmentCollection));
        });
        test("Check that deleting a non-existing apartment returns an error", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = apartmentUtils.del(99);

            // assert
            const expectedError = `apartment with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeApartments = apartmentFixtures.threeApartments;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, apartments: threeApartments }));

            // act
            const result = apartmentUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});