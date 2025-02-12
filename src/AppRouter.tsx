import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import Login from "./page/Login";
import Register from "./page/Register";
import App from "./page/app/home";
import AppLayout from "./page/app/AppLayout";
import Profile from "./page/app/Profile";

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Redirect}/>
          <Route path="/login" Component={Login}/>
          <Route path="/register" Component={Register}/>
          <Route element={<AppLayout/>} >
            <Route path="/app" index element={<App/>}/>
            <Route path="/app/profile" element={<Profile/>}/>
          </Route>
          <Route path="/app/test" Component={test}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

function test() {
  return (
    <>test</>
  )
}

function Redirect() {

  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login')
  })

  return <>testttt</>
}