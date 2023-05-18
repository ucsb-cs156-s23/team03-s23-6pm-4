import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ApartmentCreatePage from "main/pages/Apartments/ApartmentCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/apartmentUtils', () => {
    return {
        __esModule: true,
        apartmentUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("ApartmentCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /apartments on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
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
                    <ApartmentCreatePage />
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

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Santa Ynez' } })
            fireEvent.change(addressInput, { target: { value: '6750 El Colegio Road' } })
            fireEvent.change(cityInput, { target: { value: 'Goleta' } })
            fireEvent.change(stateInput, { target: { value: 'CA' } })
            fireEvent.change(roomsInput, { target: { value: 200 } })
            fireEvent.change(descriptionInput, { target: { value: 'Seems nice' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/apartments"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdApartment: {"apartment":{"id":3,"name":"Santa Ynez","address":"6750 El Colegio Road","city":"Goleta","state":"CA","rooms":200,"description":"Seems nice"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


