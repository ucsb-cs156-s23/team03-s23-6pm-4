import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ApartmentTable from 'main/components/Apartments/ApartmentTable';
import { apartmentUtils } from 'main/utils/apartmentUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function ApartmentIndexPage() {

    const navigate = useNavigate();

    const apartmentCollection = apartmentUtils.get();
    const apartments = apartmentCollection.apartments;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`ApartmentIndexPage deleteCallback: ${showCell(cell)})`);
        apartmentUtils.del(cell.row.values.id);
        navigate("/apartments");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/apartments/create">
                    Create Apartment
                </Button>
                <h1>Apartments</h1>
                <ApartmentTable apartments={apartments} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}