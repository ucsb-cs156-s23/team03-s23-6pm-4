import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ApartmentForm from "main/components/Apartments/ApartmentForm";
import { useNavigate } from 'react-router-dom'
import { apartmentUtils } from 'main/utils/apartmentUtils';

export default function ApartmentCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (apartment) => {
    const createdApartment = apartmentUtils.add(apartment);
    console.log("createdApartment: " + JSON.stringify(createdApartment));
    navigate("/apartments");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Apartment</h1>
        <ApartmentForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}