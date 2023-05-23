import { render, waitFor, fireEvent } from "@testing-library/react";
import MusicCreatePage from "main/pages/Musics/MusicCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MusicCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    //const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const Music = {
            id: 3,
            title: "Everything Goes On",
            album: "Everything Goes On",
            artist: "Porter Robinson",
            genre: "EDM"
        };

        axiosMock.onPost("/api/music/post").reply( 202, Music );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MusicCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("MusicForm-title")).toBeInTheDocument();
        });

        const titleField = getByTestId("MusicForm-title");
        const albumField = getByTestId("MusicForm-album");
        const artistField = getByTestId("MusicForm-artist");
        const genreField = getByTestId("MusicForm-genre");
        const submitButton = getByTestId("MusicForm-submit");

        fireEvent.change(titleField, { target: { value: 'Everything Goes On' } });
        fireEvent.change(albumField, { target: { value: 'Everything Goes On' } });
        fireEvent.change(genreField, { target: { value: 'Porter Robinson' } });
        fireEvent.change(genreField, { target: { value: 'EDM' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "title": "Everything Goes On",
            "album": "Everything Goes On",
            "artist": "Porter Robinson",
            "genre": "EDM"

        });

        expect(mockToast).toBeCalledWith("New Music Created - id: 3 title: Everything Goes On");
        expect(mockNavigate).toBeCalledWith({ "to": "/musics/list" });
    });


});


