import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/musicUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MusicTable({
    musics,
    showButtons = true,
    testIdPrefix = "MusicTable",
    currentUser
    }) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        navigate(`/musics/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/musics/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/music/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


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
        }
    ];

    if (showButtons) {
        columns.push(ButtonColumn("Details", "primary", detailsCallback, testIdPrefix));
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
            columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
        } 
    }
    
    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedMusics = React.useMemo(() => musics, [musics]);

    return <OurTable
        data={memoizedMusics}
        columns={memoizedColumns}
        testid={testIdPrefix}
    />;
};
