
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { musicUtils }  from 'main/utils/musicUtils';
import MusicForm from 'main/components/Musics/MusicForm';
import { useNavigate } from 'react-router-dom'


export default function MusicEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = musicUtils.getById(id);

    const onSubmit = async (music) => {
        const updatedMusic = musicUtils.update(music);
        console.log("updatedMusic: " + JSON.stringify(updatedMusic));
        navigate("/musics");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Music</h1>
                <MusicForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.music}/>
            </div>
        </BasicLayout>
    )
}