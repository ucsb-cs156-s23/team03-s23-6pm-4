import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MusicTable from 'main/components/Musics/MusicTable';
import { musicUtils } from 'main/utils/musicUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function MusicIndexPage() {

    const navigate = useNavigate();

    const musicCollection = musicUtils.get();
    const musics = musicCollection.musics;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`MusicIndexPage deleteCallback: ${showCell(cell)})`);
        musicUtils.del(cell.row.values.id);
        navigate("/musics");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/musics/create">
                    Create Music
                </Button>
                <h1>Musics</h1>
                <MusicTable musics={musics} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}