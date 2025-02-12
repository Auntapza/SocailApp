import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Suspense, use } from "react";
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
    } catch {
        
    }
}

function ProfileLink() {

    const data = use(dataPromise);

    return (
        <>
            {data.profile_img == null ?
                <Link to={'/app/profile'}>
                    <FontAwesomeIcon icon={faUser} className="size-8" />
                    Profile
                </Link>
                :
                <Link to={'/app/profile'} className="flex items-center gap-3">
                    <img
                        src={data.profile_img}
                        alt="" 
                        className="size-6 rounded-full"
                    />
                    Profile
                </Link>
            }
        </>
    )
}

function Sidebar() {
    return (
        <div className="hidden md:block space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="font-semibold mb-4">Menu</h2>
                <ul className="space-y-2">
                    <li className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                        <Suspense fallback={<>Loadding...</>}>
                            <ProfileLink />
                        </Suspense>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                        <Link to={'/app'}>
                            <FontAwesomeIcon icon={faHome} className="mx-2"/>
                            Home
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar