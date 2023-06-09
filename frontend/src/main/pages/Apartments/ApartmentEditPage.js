import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ApartmentForm from "main/components/Apartments/ApartmentForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ApartmentEditPage() {
  let { id } = useParams();

  const { data: apartment, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/apartments?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/apartments`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (apartment) => ({
    url: "/api/apartments",
    method: "PUT",
    params: {
      id: apartment.id,
    },
    data: {
      name: apartment.name,
      address: apartment.address,
      city: apartment.city,
      state: apartment.state,
      rooms: apartment.rooms,
      description: apartment.description
    }
  });

  const onSuccess = (apartment) => {
    toast(`Apartment Updated - id: ${apartment.id} name: ${apartment.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/apartments?id=${id}`]
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
        <h1>Edit Apartment</h1>
        {apartment &&
          <ApartmentForm initialContents={apartment} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}