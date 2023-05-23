import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MusicTable from 'main/components/Musics/MusicTable';
import { musicUtils } from 'main/utils/musicUtils';
import { useBackend, useBackendMutation } from "main/utils/useBackend";

export default function MusicDetailsPage() {
  let { id } = useParams();


  const { data: music, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/music?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/music`,
        params: {
          id
        }
      }
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Music Details</h1>
        {music && <MusicTable musics={[music]} showButtons={false} />}
      </div>
    </BasicLayout>
  )
}
