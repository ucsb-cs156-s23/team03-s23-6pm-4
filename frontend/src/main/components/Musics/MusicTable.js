import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { musicUtils } from "main/utils/musicUtils";

const showCell = (cell) => JSON.stringify(cell.row.values);


const defaultDeleteCallback = async (cell) => {
    console.log(`deleteCallback: ${showCell(cell)})`);
    musicUtils.del(cell.row.values.id);
}

export default function MusicTable({
    musics,
    deleteCallback = defaultDeleteCallback,
    showButtons = true,
    testIdPrefix = "MusicTable" }) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/musics/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/musics/details/${cell.row.values.id}`)
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Album',
            accessor: 'album',
        },
        {
            Header: 'Artist',
            accessor: 'artist',
        },
        {
            Header: 'Genre',
            accessor: 'genre',
        },
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    ]

    const columnsToDisplay = showButtons ? buttonColumns : columns;

    return <OurTable
        data={musics}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};

export { showCell };
