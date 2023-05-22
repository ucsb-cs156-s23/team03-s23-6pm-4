import React from 'react';
import MusicTable from 'main/components/Musics/MusicTable';
import { musicFixtures } from 'fixtures/musicFixtures';

export default {
    title: 'components/Musics/MusicTable',
    component: MusicTable
};

const Template = (args) => {
    return (
        <MusicTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    musics: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    musics: musicFixtures.threeMusics,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    musics: musicFixtures.threeMusics,
    showButtons: true
};
