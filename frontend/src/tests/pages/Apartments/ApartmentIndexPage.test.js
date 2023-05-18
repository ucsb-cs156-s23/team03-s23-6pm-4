import { render, screen, waitFor } from "@testing-library/react";
import ApartmentIndexPage from "main/pages/Apartments/ApartmentIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/apartmentUtils', () => {
    return {
        __esModule: true,
        apartmentUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    apartments: [
                        {
                            "id": 3,
                            "name": "San Joaquin North Villages",
                            "address": "650 Storke Road",
                            "city": "Goleta",
                            "state": "CA",
                            "rooms": 166,
                            "description": "Nice but Far"
                        },
                    ]
                }
            }
        }
    }
});


describe("ApartmentIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createApartmentButton = screen.getByText("Create Apartment");
        expect(createApartmentButton).toBeInTheDocument();
        expect(createApartmentButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("San Joaquin North Villages");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Nice but Far");
        expect(description).toBeInTheDocument();

        expect(screen.getByTestId("ApartmentTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("ApartmentTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("ApartmentTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("San Joaquin North Villages");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Nice but Far");
        expect(description).toBeInTheDocument();

        const deleteButton = screen.getByTestId("ApartmentTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/apartments"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `ApartmentIndexPage deleteCallback: {"id":3,"name":"San Joaquin North Villages","address":"650 Storke Road","city":"Goleta","state":"CA","rooms":166,"description":"Nice but Far"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


