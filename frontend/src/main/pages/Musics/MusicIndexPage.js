import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MusicTable from 'main/components/Musics/MusicTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function MusicIndexPage() {

  const currentUser = useCurrentUser();

  const { data: musics, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/music/all"],
      { method: "GET", url: "/api/music/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Musics</h1>
        <MusicTable musics={musics} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}