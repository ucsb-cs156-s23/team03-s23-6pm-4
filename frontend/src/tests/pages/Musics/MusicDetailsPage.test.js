import { render, screen } from "@testing-library/react";
import MusicDetailsPage from "main/pages/Musics/MusicDetailsPage";
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

jest.mock('main/utils/musicUtils', () => {
    return {
        __esModule: true,
        musicUtils: {
            getById: (_id) => {
                return {
                    music: {
                        id: 3,
                        title: "Let You Down",
                        album: "Perception",
                        artist: "NF",
                        genre: "Hip hop"
                    }
                }
            }
        }
    }
});

describe("MusicDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Let You Down")).toBeInTheDocument();
        //expect(screen.getByText("Perception")).toBeInTheDocument();
        expect(screen.getByText("NF")).toBeInTheDocument();
        expect(screen.getByText("Hip hop")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


