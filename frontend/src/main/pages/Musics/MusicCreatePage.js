import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MusicForm from "main/components/Musics/MusicForm";
import { useNavigate } from 'react-router-dom'
import { musicUtils } from 'main/utils/musicUtils';

export default function MusicCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (music) => {
    const createdMusic = musicUtils.add(music);
    console.log("createdMusic: " + JSON.stringify(createdMusic));
    navigate("/musics");
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
