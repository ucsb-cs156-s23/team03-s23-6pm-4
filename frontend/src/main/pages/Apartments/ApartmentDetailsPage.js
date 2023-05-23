import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ApartmentTable from 'main/components/Apartments/ApartmentTable';
import { useBackend, useBackendMutation } from "main/utils/useBackend";

export default function ApartmentDetailsPage() {
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

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Apartment Details</h1>
        {apartment && <ApartmentTable apartments={[apartment]} />}
      </div>
    </BasicLayout>
  )
}