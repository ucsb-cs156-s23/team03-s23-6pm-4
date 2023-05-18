import React from 'react';
import ApartmentTable from 'main/components/Apartments/ApartmentTable';
import { apartmentFixtures } from 'fixtures/apartmentFixtures';

export default {
    title: 'components/Apartments/ApartmentTable',
    component: ApartmentTable
};

const Template = (args) => {
    return (
        <ApartmentTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    apartments: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    apartments: apartmentFixtures.threeApartments,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    apartments: apartmentFixtures.threeApartments,
    showButtons: true
};
