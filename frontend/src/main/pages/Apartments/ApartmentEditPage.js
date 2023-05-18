
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { apartmentUtils }  from 'main/utils/apartmentUtils';
import ApartmentForm from 'main/components/Apartments/ApartmentForm';
import { useNavigate } from 'react-router-dom'


export default function ApartmentEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = apartmentUtils.getById(id);

    const onSubmit = async (apartment) => {
        const updatedApartment = apartmentUtils.update(apartment);
        console.log("updatedApartment: " + JSON.stringify(updatedApartment));
        navigate("/apartments");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Apartment</h1>
                <ApartmentForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.apartment}/>
            </div>
        </BasicLayout>
    )
}