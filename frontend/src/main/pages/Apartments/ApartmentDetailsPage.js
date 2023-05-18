import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ApartmentTable from 'main/components/Apartments/ApartmentTable';
import { apartmentUtils } from 'main/utils/apartmentUtils';

export default function ApartmentDetailsPage() {
  let { id } = useParams();

  const response = apartmentUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Apartment Details</h1>
        <ApartmentTable apartments={[response.apartment]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
