import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/apartmentUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function ApartmentTable({ apartments, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/apartment/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/apartment/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/apartment/all"]
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
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Address',
            accessor: 'address',
        },
        {
            Header: 'City',
            accessor: 'city',
        },
        {
            Header: 'State',
            accessor: 'state',
        },
        {
            Header: 'Rooms',
            accessor: 'rooms',
        },
        {
            Header: 'Description',
            accessor: 'description',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "ApartmentTable"));
        columns.push(ButtonColumn("Details", "primary", detailsCallback, "ApartmentTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "ApartmentTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedApartments = React.useMemo(() => apartments, [apartments]);

    return <OurTable
        data={memoizedApartments}
        columns={memoizedColumns}
        testid={"ApartmentTable"}
    />;
};