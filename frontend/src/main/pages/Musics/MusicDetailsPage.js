import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MusicTable from 'main/components/Musics/MusicTable';
import { musicUtils } from 'main/utils/musicUtils';

export default function MusicDetailsPage() {
  let { id } = useParams();

  const response = musicUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Music Details</h1>
        <MusicTable musics={[response.music]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
