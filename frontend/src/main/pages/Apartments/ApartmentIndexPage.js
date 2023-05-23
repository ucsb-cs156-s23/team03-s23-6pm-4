import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ApartmentTable from 'main/components/Apartments/ApartmentTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function ApartmentIndexPage() {

  const currentUser = useCurrentUser();

  const { data: apartments, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/apartments/all"],
      { method: "GET", url: "/api/apartments/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Apartment</h1>
        <ApartmentTable apartments={apartments} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}