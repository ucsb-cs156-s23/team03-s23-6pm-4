import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import MusicCreatePage from "main/pages/Musics/MusicCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/musicUtils', () => {
    return {
        __esModule: true,
        musicUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("MusicCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /musics on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "music": {
                id: 3,
                title: "Everything Goes On",
                album: "Everything Goes On",
                artist: "Porter Robinson",
                genre: "Pop"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const authorInput = screen.getByLabelText("Album");
        expect(authorInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Artist");
        expect(descriptionInput).toBeInTheDocument();

        const genreInput = screen.getByLabelText("Genre");
        expect(genreInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();
            
        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Everything Goes On' } })
            fireEvent.change(authorInput, { target: { value: 'Everything Goes On' } })
            fireEvent.change(descriptionInput, { target: { value: 'Porter Robinson' } })
            fireEvent.change(genreInput, { target: { value: 'Pop' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/musics"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdMusic: {"music":{"id":3,"title":"Everything Goes On","album":"Everything Goes On","artist":"Porter Robinson","genre":"Pop"}`
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


