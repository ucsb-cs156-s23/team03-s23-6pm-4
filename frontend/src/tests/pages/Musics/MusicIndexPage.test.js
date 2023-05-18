import { render, screen, waitFor } from "@testing-library/react";
import MusicIndexPage from "main/pages/Musics/MusicIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/musicUtils', () => {
    return {
        __esModule: true,
        musicUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    musics: [
                        {
                            "id": 3,
                            "title": "Let You Down",
                            "album": "Perception",
                            "artist": "NF",
                            "genre": "Hip hop",
                        },
                    ]
                }
            }
        }
    }
});


describe("MusicIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createMusicButton = screen.getByText("Create Music");
        expect(createMusicButton).toBeInTheDocument();
        expect(createMusicButton).toHaveAttribute("style", "float: right;");

        const title = screen.getByText("Let You Down");
        expect(title).toBeInTheDocument();

        const album = screen.getByText("Perception");
        expect(album).toBeInTheDocument();

        const artist = screen.getByText("NF");
        expect(artist).toBeInTheDocument();

        const genre = screen.getByText("Hip hop");
        expect(genre).toBeInTheDocument();

        expect(screen.getByTestId("MusicTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("MusicTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("MusicTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const title = screen.getByText("Let You Down");
        expect(title).toBeInTheDocument();

        const album = screen.getByText("Perception");
        expect(album).toBeInTheDocument();

        const artist = screen.getByText("NF");
        expect(artist).toBeInTheDocument();

        const genre = screen.getByText("Hip hop");
        expect(genre).toBeInTheDocument(); 

        const deleteButton = screen.getByTestId("MusicTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/musics"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `MusicIndexPage deleteCallback: {"id":3,"title":"Let You Down","album":"Perception","artist":"NF","genre":"Hip hop"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});

