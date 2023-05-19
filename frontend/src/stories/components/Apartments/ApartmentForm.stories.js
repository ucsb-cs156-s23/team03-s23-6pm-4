import React from 'react';
import ApartmentForm from "main/components/Apartments/ApartmentForm"
import { apartmentFixtures } from 'fixtures/apartmentFixtures';

export default {
    title: 'components/Apartments/ApartmentForm',
    component: ApartmentForm
};

const Template = (args) => {
    return (
        <ApartmentForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Apartment: apartmentFixtures.oneApartment,
    submitText: "",
    submitAction: () => { }
};