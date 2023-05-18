import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import ApartmentEditPage from "main/pages/Apartments/ApartmentEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/apartmentUtils', () => {
    return {
        __esModule: true,
        apartmentUtils: {
            update: (_apartment) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    apartment: {
                        id: 3,
                        name: "San Joaquin North Villages",
                        address: "650 Storke Road",
                        city: "Goleta",
                        state: "CA",
                        rooms: 166,
                        description: "Nice but Far",
                    }
                }
            }
        }
    }
});


describe("ApartmentEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("ApartmentForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('San Joaquin North Villages')).toBeInTheDocument();
        expect(screen.getByDisplayValue('650 Storke Road')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Goleta')).toBeInTheDocument();
        expect(screen.getByDisplayValue('CA')).toBeInTheDocument();
        expect(screen.getByDisplayValue('166')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Nice but Far')).toBeInTheDocument();
    });

    test("redirects to /apartments on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "apartment": {
                id: 3,
                name: "Santa Ynez",
                address: "6750 El Colegio Road",
                city: "Goleta",
                state: "CA",
                rooms: 200,
                description: "Seems nice"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const addressInput = screen.getByLabelText("Address");
        expect(addressInput).toBeInTheDocument();

        const cityInput = screen.getByLabelText("City");
        expect(cityInput).toBeInTheDocument();

        const stateInput = screen.getByLabelText("State");
        expect(stateInput).toBeInTheDocument();

        const roomsInput = screen.getByLabelText("Rooms");
        expect(roomsInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Santa Ynez' } })
            fireEvent.change(addressInput, { target: { value: '6750 El Colegio Road' } })
            fireEvent.change(cityInput, { target: { value: 'Goleta' } })
            fireEvent.change(stateInput, { target: { value: 'CA' } })
            fireEvent.change(roomsInput, { target: { value: 200 } })
            fireEvent.change(descriptionInput, { target: { value: 'Seems nice' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/apartments"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedApartment: {"apartment":{"id":3,"name":"Santa Ynez","address":"6750 El Colegio Road","city":"Goleta","state":"CA","rooms":200,"description":"Seems nice"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


