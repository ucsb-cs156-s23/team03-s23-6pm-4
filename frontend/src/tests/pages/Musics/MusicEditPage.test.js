import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MusicEditPage from "main/pages/Musics/MusicEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MusicEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/music", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MusicEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Music");
            expect(queryByTestId("MusicForm-title")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/music", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "NUMB",
                album: "?"
            });
            axiosMock.onPut('/api/music').reply(200, {
                id: "17",
                title: "Lifeline",
                album: "ILLENIUM"
            });
        });

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

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MusicEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("MusicForm-title");

            const idField = getByTestId("MusicForm-id");
            const titleField = getByTestId("MusicForm-title");
            const albumField = getByTestId("MusicForm-album");
            const submitButton = getByTestId("MusicForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("NUMB");
            expect(albumField).toHaveValue("?");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MusicEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("MusicForm-title");

            const idField = getByTestId("MusicForm-id");
            const titleField = getByTestId("MusicForm-title");
            const albumField = getByTestId("MusicForm-album");
            const submitButton = getByTestId("MusicForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("NUMB");
            expect(albumField).toHaveValue("?");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'Lifeline' } })
            fireEvent.change(albumField, { target: { value: "ILLENIUM" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Music Updated - id: 17 title: Lifeline");
            expect(mockNavigate).toBeCalledWith({ "to": "/musics/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "Lifeline",
                album: "ILLENIUM"
            })); // posted object

        });

       
    });
});


