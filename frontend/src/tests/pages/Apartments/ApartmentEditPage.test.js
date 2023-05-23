import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ApartmentEditPage from "main/pages/Apartments/ApartmentEditPage";

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

describe("ApartmentEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/apartments", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ApartmentEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Apartment");
            expect(queryByTestId("ApartmentForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/apartments", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "Sierra Madre Villages",
                address: "555 Storke Road",
                city: "Goleta",
                state: "CA",
                rooms: 109,
                description: "Nice and New"
            });
            axiosMock.onPut('/api/apartments').reply(200, {
                id: "17",
                name: "El Dorado",
                address: "6667 El Colegio Road",
                city: "Goleta",
                state: "CA",
                rooms: 50,
                description: "Tropicana but Nicer"
            });
        });

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

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ApartmentEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("ApartmentForm-name");

            const idField = getByTestId("ApartmentForm-id");
            const nameField = getByTestId("ApartmentForm-name");
            const addressField = getByTestId("ApartmentForm-address");
            const cityField = getByTestId("ApartmentForm-city");
            const stateField = getByTestId("ApartmentForm-state");
            const roomsField = getByTestId("ApartmentForm-rooms");
            const descriptionField = getByTestId("ApartmentForm-description");
            const submitButton = getByTestId("ApartmentForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Sierra Madre Villages");
            expect(addressField).toHaveValue("555 Storke Road");
            expect(cityField).toHaveValue("Goleta");
            expect(stateField).toHaveValue("CA");
            expect(roomsField).toHaveValue(109);
            expect(descriptionField).toHaveValue("Nice and New");
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ApartmentEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("ApartmentForm-name");

            const idField = getByTestId("ApartmentForm-id");
            const nameField = getByTestId("ApartmentForm-name");
            const addressField = getByTestId("ApartmentForm-address");
            const cityField = getByTestId("ApartmentForm-city");
            const stateField = getByTestId("ApartmentForm-state");
            const roomsField = getByTestId("ApartmentForm-rooms");
            const descriptionField = getByTestId("ApartmentForm-description");
            const submitButton = getByTestId("ApartmentForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Sierra Madre Villages");
            expect(addressField).toHaveValue("555 Storke Road");
            expect(cityField).toHaveValue("Goleta");
            expect(stateField).toHaveValue("CA");
            expect(roomsField).toHaveValue(109);
            expect(descriptionField).toHaveValue("Nice and New");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'El Dorado' } });
            fireEvent.change(addressField, { target: { value: '6667 El Colegio Road' } });
            fireEvent.change(cityField, { target: { value: 'Goleta' } });
            fireEvent.change(stateField, { target: { value: 'CA' } });
            fireEvent.change(roomsField, { target: { value: 50 } });
            fireEvent.change(descriptionField, { target: { value: 'Tropicana but Nicer' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Apartment Updated - id: 17 name: El Dorado");
            expect(mockNavigate).toBeCalledWith({ "to": "/apartments/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "El Dorado",
                address: "6667 El Colegio Road",
                city: "Goleta",
                state: "CA",
                rooms: '50',
                description: "Tropicana but Nicer"
            })); // posted object

        });
       
    });
});