import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import ApartmentCreatePage from "main/pages/Apartments/ApartmentCreatePage";
import ApartmentEditPage from "main/pages/Apartments/ApartmentEditPage";
import ApartmentIndexPage from "main/pages/Apartments/ApartmentIndexPage";
import ApartmentDetailsPage from "main/pages/Apartments/ApartmentDetailsPage";

import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import MusicCreatePage from "main/pages/Musics/MusicCreatePage";
import MusicEditPage from "main/pages/Musics/MusicEditPage";
import MusicIndexPage from "main/pages/Musics/MusicIndexPage";
import MusicDetailsPage from "main/pages/Musics/MusicDetailsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
              <Route exact path="/restaurants/list" element={<RestaurantIndexPage />} /> 
            </>
          )
        } 

        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/musics/create" element={<MusicCreatePage />} />
              <Route exact path="/musics/edit/:id" element={<MusicEditPage />} />
              <Route exact path="/musics/details/:id" element={<MusicDetailsPage />} />
              <Route exact path="/musics/list" element={<MusicIndexPage />} /> 
            </>
          )
        }

{
        hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/apartments/create" element={<ApartmentCreatePage />} />
              <Route exact path="/apartments/edit/:id" element={<ApartmentEditPage />} />
              <Route exact path="/apartments/details/:id" element={<ApartmentDetailsPage />} />
              <Route exact path="/apartments/list" element={<ApartmentIndexPage />} />
            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
}

export default App;
