import { render, screen } from "@testing-library/react";
import ApartmentDetailsPage from "main/pages/Apartments/ApartmentDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/apartmentUtils', () => {
    return {
        __esModule: true,
        apartmentUtils: {
            getById: (_id) => {
                return {
                    apartment: {
                        id: 3,
                        name: "San Joaquin North Villages",
                        address: "650 Storke Road",
                        city: "Goleta",
                        state: "CA",
                        rooms: 166,
                        description: "Nice",
                    }
                }
            }
        }
    }
});

describe("ApartmentDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("San Joaquin North Villages")).toBeInTheDocument();
        expect(screen.getByText("650 Storke Road")).toBeInTheDocument();
        expect(screen.getByText("Goleta")).toBeInTheDocument();
        expect(screen.getByText("CA")).toBeInTheDocument();
        expect(screen.getByText(166)).toBeInTheDocument();
        expect(screen.getByText("Nice")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


