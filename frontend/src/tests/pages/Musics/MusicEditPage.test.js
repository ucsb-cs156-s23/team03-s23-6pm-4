import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import MusicEditPage from "main/pages/Musics/MusicEditPage";
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
jest.mock('main/utils/musicUtils', () => {
    return {
        __esModule: true,
        musicUtils: {
            update: (_music) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    music: {
                        id: 3,
                        title: "Cupid",
                        album: "The Beginning",
                        artist: "FIFTY FIFTY",
                        genre: "K-pop"
                    }
                }
            }
        }
    }
});


describe("MusicEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("MusicForm-title")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Cupid')).toBeInTheDocument();
        expect(screen.getByDisplayValue('FIFTY FIFTY')).toBeInTheDocument();
    });

    test("redirects to /musics on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "music": {
                id: 3,
                title: "Cupid",
                album: "The Beginning",
                artist: "FIFTY FIFTY",
                genre: "K-pop"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const albumInput = screen.getByLabelText("Album");
        expect(albumInput).toBeInTheDocument();


        const artistInput = screen.getByLabelText("Artist");
        expect(artistInput).toBeInTheDocument();

        const genreInput = screen.getByLabelText("Genre");
        expect(genreInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Cupid' } })
            fireEvent.change(albumInput, { target: { value: 'The Beginning' } })
            fireEvent.change(artistInput, { target: { value: 'FIFTY FIFTY' } })
            fireEvent.change(genreInput, { target: { value: 'K-pop' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/musics"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedMusic: {"music":{"id":3,"title":"Cupid","album":"The Beginning","artist":"FIFTY FIFTY","genre":"K-pop"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


