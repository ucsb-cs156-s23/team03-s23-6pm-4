import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { restaurantUtils } from 'main/utils/restaurantUtils';
import { useBackend, useBackendMutation } from "main/utils/useBackend";

export default function RestaurantDetailsPage() {
  let { id } = useParams();


  const { data: restaurant, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/restaurant?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/restaurant`,
        params: {
          id
        }
      }
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        {restaurant && <RestaurantTable restaurants={[restaurant]} showButtons={false} />}
      </div>
    </BasicLayout>
  )
}
