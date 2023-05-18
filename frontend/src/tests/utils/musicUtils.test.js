import { musicFixtures } from "fixtures/musicFixtures";
import { musicUtils } from "main/utils/musicUtils";

describe("musicUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "musics".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "musics") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When musics is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.get();

            // assert
            const expected = { nextId: 1, musics: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("musics", expectedJSON);
        });

        test("When musics is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.get();

            // assert
            const expected = { nextId: 1, musics: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("musics", expectedJSON);
        });

        test("When musics is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, musics: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.get();

            // assert
            const expected = { nextId: 1, musics: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When musics is JSON of three musics, should return that JSON", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;
            const mockMusicCollection = { nextId: 10, musics: threeMusics };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockMusicCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.get();

            // assert
            expect(result).toEqual(mockMusicCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting an music by id works", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;
            const idToGet = threeMusics[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            // act
            const result = musicUtils.getById(idToGet);

            // assert

            const expected = { music: threeMusics[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing music returns an error", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            // act
            const result = musicUtils.getById(99);

            // assert
            const expectedError = `music with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            // act
            const result = musicUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one music works", () => {

            // arrange
            const music = musicFixtures.oneMusic[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, musics: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.add(music);

            // assert
            expect(result).toEqual(music);
            expect(setItemSpy).toHaveBeenCalledWith("musics",
                JSON.stringify({ nextId: 2, musics: musicFixtures.oneMusic }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing music works", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;
            const updatedMusic = {
                ...threeMusics[0],
                name: "Updated Name"
            };
            const threeMusicsUpdated = [
                updatedMusic,
                threeMusics[1],
                threeMusics[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.update(updatedMusic);

            // assert
            const expected = { musicCollection: { nextId: 5, musics: threeMusicsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("musics", JSON.stringify(expected.musicCollection));
        });
        test("Check that updating an non-existing music returns an error", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedMusic = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = musicUtils.update(updatedMusic);

            // assert
            const expectedError = `music with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting an music by id works", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;
            const idToDelete = threeMusics[1].id;
            const threeMusicsUpdated = [
                threeMusics[0],
                threeMusics[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.del(idToDelete);

            // assert

            const expected = { musicCollection: { nextId: 5, musics: threeMusicsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("musics", JSON.stringify(expected.musicCollection));
        });
        test("Check that deleting a non-existing music returns an error", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = musicUtils.del(99);

            // assert
            const expectedError = `music with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeMusics = musicFixtures.threeMusics;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, musics: threeMusics }));

            // act
            const result = musicUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});