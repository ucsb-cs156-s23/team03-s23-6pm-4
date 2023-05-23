import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ApartmentDetailsPage from "main/pages/Apartments/ApartmentDetailsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apartmentFixtures } from "fixtures/apartmentFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x),
    };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1,
        }),
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        },
    };
});

describe("ApartmentDetailsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ApartmentTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders one apartment without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sierra Madre Villages",
            address: "555 Storke Road",
            city: "Goleta",
            state: "CA",
            rooms: 109,
            description: "Nice and New"
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Sierra Madre Villages");
        expect(getByTestId(`${testId}-cell-row-0-col-address`)).toHaveTextContent("555 Storke Road");
        expect(getByTestId(`${testId}-cell-row-0-col-city`)).toHaveTextContent("Goleta");
        expect(getByTestId(`${testId}-cell-row-0-col-state`)).toHaveTextContent("CA");
        expect(getByTestId(`${testId}-cell-row-0-col-rooms`)).toHaveTextContent("109");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("Nice and New");
        
        expect(queryByTestId("Delete")).not.toBeInTheDocument();
        expect(queryByTestId("Edit")).not.toBeInTheDocument();
        expect(queryByTestId("Details")).not.toBeInTheDocument();
    });

    test("renders one apartment without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sierra Madre Villages",
            address: "555 Storke Road",
            city: "Goleta",
            state: "CA",
            rooms: 109,
            description: "Nice and New"
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Sierra Madre Villages");
        expect(getByTestId(`${testId}-cell-row-0-col-address`)).toHaveTextContent("555 Storke Road");
        expect(getByTestId(`${testId}-cell-row-0-col-city`)).toHaveTextContent("Goleta");
        expect(getByTestId(`${testId}-cell-row-0-col-state`)).toHaveTextContent("CA");
        expect(getByTestId(`${testId}-cell-row-0-col-rooms`)).toHaveTextContent("109");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("Nice and New");
        
        expect(queryByTestId("Delete")).not.toBeInTheDocument();
        expect(queryByTestId("Edit")).not.toBeInTheDocument();
        expect(queryByTestId("Details")).not.toBeInTheDocument();

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
        });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch(
            "Error communicating with backend via GET on /api/apartments"
        );
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });
});

/*
import { fireEvent, queryByTestId, render, waitFor, screen } from "@testing-library/react";
import ApartmentDetailsPage from "main/pages/Apartments/ApartmentDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apartmentFixtures } from "fixtures/apartmentFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 1
    }),
    useNavigate: () => mockNavigate
}));


describe("ApartmentDetailsPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    //const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ApartmentTable";

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/apartment", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sierra Madre Villages",
            address: "555 Storke Road",
            city: "Goleta",
            state: "CA",
            rooms: 109,
            description: "Nice and New"
        });
    });

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

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Sierra Madre Villages");
        expect(getByTestId(`${testId}-cell-row-0-col-address`)).toHaveTextContent("555 Storke Road");
        expect(getByTestId(`${testId}-cell-row-0-col-city`)).toHaveTextContent("Goleta");
        expect(getByTestId(`${testId}-cell-row-0-col-state`)).toHaveTextContent("CA");
        expect(getByTestId(`${testId}-cell-row-0-col-rooms`)).toHaveTextContent("109");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("Nice and New");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});

import { fireEvent, queryByTestId, render, waitFor, screen } from "@testing-library/react";
import ApartmentDetailsPage from "main/pages/Apartments/ApartmentDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apartmentFixtures } from "fixtures/apartmentFixtures";
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
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ApartmentDetailsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ApartmentTable";

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/apartment", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sierra Madre Villages",
            address: "555 Storke Road",
            city: "Goleta",
            state: "CA",
            rooms: 109,
            description: "Nice and New"
        });
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Is populated with the data provided", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments").reply(200, []);

        const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Sierra Madre Villages");
        expect(getByTestId(`${testId}-cell-row-0-col-address`)).toHaveTextContent("555 Storke Road");
        expect(getByTestId(`${testId}-cell-row-0-col-city`)).toHaveTextContent("Goleta");
        expect(getByTestId(`${testId}-cell-row-0-col-state`)).toHaveTextContent("CA");
        expect(getByTestId(`${testId}-cell-row-0-col-rooms`)).toHaveTextContent("109");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("Nice and New");
    });

    test("loads the correct fields without buttons", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartments").reply(200, apartmentFixtures.oneApartment);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Sierra Madre Villages");
        expect(getByTestId(`${testId}-cell-row-0-col-address`)).toHaveTextContent("555 Storke Road");
        expect(getByTestId(`${testId}-cell-row-0-col-city`)).toHaveTextContent("Goleta");
        expect(getByTestId(`${testId}-cell-row-0-col-state`)).toHaveTextContent("CA");
        expect(getByTestId(`${testId}-cell-row-0-col-rooms`)).toHaveTextContent("109");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("Nice and New");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});

/*
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 1
    }),
    useNavigate: () => mockNavigate
}));

describe("ApartmentDetailsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ApartmentTable";

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/apartment", { params: { id: 1 } }).reply(200, {
            "id": 1,
            "name": "Sierra Madre Villages",
            "address": "555 Storke Road",
            "city": "Goleta",
            "state": "CA",
            "rooms": 109,
            "description": "Nice and New"
        });
    });

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

    test("loads the correct fields without buttons", async () => {

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Sierra Madre Villages");
        expect(getByTestId(`${testId}-cell-row-0-col-address`)).toHaveTextContent("555 Storke Road");
        expect(getByTestId(`${testId}-cell-row-0-col-city`)).toHaveTextContent("Goleta");
        expect(getByTestId(`${testId}-cell-row-0-col-state`)).toHaveTextContent("CA");
        expect(getByTestId(`${testId}-cell-row-0-col-rooms`)).toHaveTextContent("109");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("Nice and New");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});

/*
const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("ApartmentDetailsPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "ApartmentTable";

    const setup = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing", () => {
        setup();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartment/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders apartment without crashing", async () => {
        setup();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartment/all").reply(200, apartmentFixtures.oneApartment);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Sierra Madre Villages");
        expect(getByTestId(`${testId}-cell-row-0-col-address`)).toHaveTextContent("555 Storke Road");
        expect(getByTestId(`${testId}-cell-row-0-col-city`)).toHaveTextContent("Goleta");
        expect(getByTestId(`${testId}-cell-row-0-col-state`)).toHaveTextContent("CA");
        expect(getByTestId(`${testId}-cell-row-0-col-rooms`)).toHaveTextContent("109");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("Nice and New");

    });

    test("renders without buttons", async () => {
        setup();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartment/all").reply(200, apartmentFixtures.oneApartment);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.queryByText("Delete")).not.toBeInTheDocument(); });
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();

    });

    test("renders empty table when backend unavailable", async () => {
        setup();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/apartment/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ApartmentDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/apartment");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });
})
*/