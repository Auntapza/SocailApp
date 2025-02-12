import axios, { AxiosError } from "axios";
import { Suspense, use } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router";

// Create the promise once, outside the component
const dataPromise = fetchData();

async function fetchData() {

    try {
        const apiLink = import.meta.env.VITE_API_LINK

        const res = await axios.get(apiLink+"/account", {
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        const error = err as AxiosError<any>
        if (error.response?.data.msg == "Can't find data") {
            window.location.href = '/login'
        }
    }
}

function ProfileData() {
    // Use the same promise instance
    const data = use(dataPromise);

    const logout = useLogout()

    return (
        <div className="flex items-center space-x-4">
            {data.profile_img == null ? <FontAwesomeIcon icon={faUser} className="size-8" /> : 
            <img
                src={data.profile_img}
                alt="Profile"
                className="w-8 h-8 rounded-full"
            />}
            
            <button className="text-red-600 z-10 cursor-pointer" onClick={logout}>Logout</button>
        </div>
    );
}

export default function NavBar() {
    return (
        <nav className="bg-white shadow-md fixed top-0 w-full z-10">
            <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to={'/app'} className="text-2xl font-bold text-blue-600 cursor-pointer">Social</Link>
                </div>
                <Suspense fallback={<>Loading...</>}>
                    <ProfileData />
                </Suspense>
            </div>
        </nav>
    );
}
