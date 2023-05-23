import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MusicForm from "main/components/Musics/MusicForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MusicCreatePage() {

  const objectToAxiosParams = (Music) => ({
    url: "/api/music/post",
    method: "POST",
    params: {
      title: Music.title,
      album: Music.album,
      artist: Music.artist,
      genre: Music.genre

    }
  });

  const onSuccess = (Music) => {
    toast(`New Music Created - id: ${Music.id} title: ${Music.title}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/music/all"]
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
        <h1>Create New Music</h1>
        <MusicForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
