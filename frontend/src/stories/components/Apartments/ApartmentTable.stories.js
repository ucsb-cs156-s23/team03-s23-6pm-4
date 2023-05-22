import React from 'react';

import ApartmentTable from "main/components/Apartments/ApartmentTable";
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

export const ThreeDates = Template.bind({});

ThreeDates.args = {
    apartments: apartmentFixtures.threeDates
};


