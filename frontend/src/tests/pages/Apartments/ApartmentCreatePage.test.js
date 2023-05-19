import { render, waitFor, fireEvent } from "@testing-library/react";
import ApartmentCreatePage from "main/pages/Apartments/ApartmentCreatePage";
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

describe("ApartmentCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

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
                    <ApartmentCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const apartment = {
            id: 17,
            name: "Sierra Madre Villages",
            //code: "sierra-madre-villages",
            address: "555 Storke Road",
            city: "Goleta",
            state: "CA",
            rooms: 109,
            description: "Nice and New"
        };

        axiosMock.onPost("/api/apartment/post").reply( 202, apartment );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("ApartmentForm-name")).toBeInTheDocument(); //not confident in replacing quarterYYYYQ with name here
        });

        const nameField = getByTestId("ApartmentForm-name");
        //const codeField = getByTestId("ApartmentForm-code");
        const addressField = getByTestId("ApartmentForm-address");
        const cityField = getByTestId("ApartmentForm-city");
        const stateField = getByTestId("ApartmentForm-state");
        const roomsField = getByTestId("ApartmentForm-rooms");
        const descriptionField = getByTestId("ApartmentForm-description");
        const submitButton = getByTestId("ApartmentForm-submit");

        fireEvent.change(nameField, { target: { value: 'Sierra Madre Villages' } });
        //fireEvent.change(codeField, { target: { value: 'sierra-madre-villages' } });
        fireEvent.change(addressField, { target: { value: '555 Storke Road' } });
        fireEvent.change(cityField, { target: { value: 'Goleta' } });
        fireEvent.change(stateField, { target: { value: 'CA' } });
        fireEvent.change(roomsField, { target: { value: '109' } });
        fireEvent.change(descriptionField, { target: { value: 'Nice and New' } });
        

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "Sierra Madre Villages",
            //"code": "sierra-madre-villages",
            "address": "555 Storke Road",
            "city": "Goleta",
            "state": "CA",
            "rooms": "109",
            "description": "Nice and New"
        });

        expect(mockToast).toBeCalledWith("New apartment Created - id: 17 name: Sierra Madre Villages");
        expect(mockNavigate).toBeCalledWith({ "to": "/apartment/list" });
    });


});