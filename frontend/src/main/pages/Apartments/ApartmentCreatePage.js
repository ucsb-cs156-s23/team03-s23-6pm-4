import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ApartmentForm from "main/components/Apartments/ApartmentForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ApartmentCreatePage() {

  const objectToAxiosParams = (apartment) => ({
    url: "/api/apartments/post",
    method: "POST",
    params: {
      name: apartment.name,
      address: apartment.address,
      city: apartment.city,
      state: apartment.state,
      rooms: apartment.rooms,
      description: apartment.description
    }
  });

  const onSuccess = (apartment) => {
    toast(`New apartment Created - id: ${apartment.id} name: ${apartment.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/apartments/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/apartments/list" />
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