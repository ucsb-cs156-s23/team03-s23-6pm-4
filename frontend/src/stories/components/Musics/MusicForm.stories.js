import React from 'react';
import MusicForm from "main/components/Musics/MusicForm"
import { restaurantFixtures } from 'fixtures/restaurantFixtures';

export default {
    title: 'components/Musics/MusicForm',
    component: MusicForm
};

const Template = (args) => {
    return (
        <MusicForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Music: restaurantFixtures.oneMusic,
    submitText: "",
    submitAction: () => { }
};