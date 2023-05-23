import { render, waitFor, fireEvent } from "@testing-library/react";
import ApartmentForm from "main/components/Apartments/ApartmentForm";
import { apartmentFixtures } from "fixtures/apartmentFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ApartmentForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <ApartmentForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });


    test("renders correctly when passing in a Apartment", async () => {

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <ApartmentForm initialContents={apartmentFixtures.oneApartment} />
            </Router>
        );
        await findByTestId(/ApartmentForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/ApartmentForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <ApartmentForm />
            </Router>
        );
        await findByTestId("ApartmentForm-name");
        const roomsField = getByTestId("ApartmentForm-rooms");
        const submitButton = getByTestId("ApartmentForm-submit");

        fireEvent.change(roomsField, { target: { value: -1 } });
        fireEvent.click(submitButton);

        await findByText(/Number of rooms must be a whole number/);
        expect(getByText(/Number of rooms must be a whole number/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <ApartmentForm />
            </Router>
        );
        await findByTestId("ApartmentForm-submit");
        const submitButton = getByTestId("ApartmentForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required./);
        expect(getByText(/Address is required./)).toBeInTheDocument();
        expect(getByText(/City is required./)).toBeInTheDocument();
        expect(getByText(/State is required./)).toBeInTheDocument();
        expect(getByText(/Number of rooms is required./)).toBeInTheDocument();
        expect(getByText(/Description is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <ApartmentForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("ApartmentForm-name");

        const nameField = getByTestId("ApartmentForm-name");
        const addressField = getByTestId("ApartmentForm-address");
        const cityField = getByTestId("ApartmentForm-city");
        const stateField = getByTestId("ApartmentForm-state");
        const roomsField = getByTestId("ApartmentForm-rooms");
        const descriptionField = getByTestId("ApartmentForm-description");
        const submitButton = getByTestId("ApartmentForm-submit");

        fireEvent.change(nameField, { target: { value: 'Sierra Madre Villages' } });
        fireEvent.change(addressField, { target: { value: '555 Storke Road' } });
        fireEvent.change(cityField, { target: { value: 'Goleta' } });
        fireEvent.change(stateField, { target: { value: 'CA' } });
        fireEvent.change(roomsField, { target: { value: 109 } });
        fireEvent.change(descriptionField, { target: { value: 'Nice and New' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Number of rooms must be a whole number/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <ApartmentForm />
            </Router>
        );
        await findByTestId("ApartmentForm-cancel");
        const cancelButton = getByTestId("ApartmentForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


