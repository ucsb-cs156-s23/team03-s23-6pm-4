import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MusicForm from "main/components/Musics/MusicForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MusicEditPage() {
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


  const objectToAxiosPutParams = (music) => ({
    url: "/api/music",
    method: "PUT",
    params: {
      id: music.id,
    },
    data: {
      name: music.name,
      description: music.description
    }
  });

  const onSuccess = (music) => {
    toast(`Music Updated - id: ${music.id} name: ${music.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/music?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/musics/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Music</h1>
        {music &&
          <MusicForm initialMusic={music} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

