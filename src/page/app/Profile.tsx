import { Dispatch, SetStateAction, useState } from 'react';
import { Suspense, use } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import EditProfileModal from '../../components/EditProfileModel';
import { Post } from './home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faSquareMinus, faUser } from '@fortawesome/free-solid-svg-icons';
import EditPostModal from '../../components/EditPostPopup';
import { showToast } from '../../lib/toastPromis';
import navigate from '../../lib/navigate';

interface UserProfile {
  user_id: number;
  username: string;
  fname: string;
  lname: string;
  profile_img: string;
  date_create: string;
}

async function fetchProfile() {
  
  const res = await axios.get<UserProfile>("http://localhost:4000/account", {
    withCredentials: true,
  });
  return res.data;
}

const profilePromise = fetchProfile();

function ProfileInfo() {
  const profile = use(profilePromise);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProfileUpdate = () => {
    // Refresh the profile data
    window.location.reload();
  };

  return (
    <div className="pt-20">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 h-32"></div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              <img
                src={profile?.profile_img || "/api/placeholder/128/128"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
              />

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-0 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>

              <h1 className="text-2xl font-bold">
                {profile.fname} {profile.lname}
              </h1>
              <p className="text-gray-600">@{profile.username}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold text-gray-700">User ID</h2>
                <p className="text-gray-600">{profile.user_id}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold text-gray-700">Joined</h2>
                <p className="text-gray-600">
                  {new Date(profile.date_create).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProfile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  );
}

const postData = fetchPost();

async function fetchPost() {
  try {
    const apiLink = import.meta.env.VITE_API_LINK
    const res = await axios.get(apiLink + "/ownPost", {
      withCredentials: true
    })
    return res.data
  } catch {
    console.log('test');
  }
}


function PostCard({ posts, setPostId, setOpen }: {
  posts: Post[],
  setPostId: Dispatch<SetStateAction<number | undefined>>,
  setOpen: Dispatch<SetStateAction<boolean>>
}) {

  const to = navigate()
  
  async function DeletePost(postId: number) {
    if (postId) {
      const apiLink = import.meta.env.VITE_API_LINK
      if (confirm("Do you want to delete Post?")) {
        const res = axios.delete(apiLink+"/post/"+postId);
        await showToast(res);
        to(0)
      }
    }
  }

  return (
    <>
      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className='flex justify-between items-center'>
            <div className="flex items-center space-x-2 mb-4">
              {post.user.avatar ?
                <img
                  src={post.user.avatar as string}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full"
                />
                :
                <FontAwesomeIcon icon={faUser} className='w-10 h-10 rounded-full' />
              }
              <div>
                <h3 className="font-semibold">{post.user.name}</h3>
              </div>
            </div>
            <div className='flex gap-5 items-center'>
              <FontAwesomeIcon icon={faSquareMinus} className='text-red-500 cursor-pointer' onClick={()=> {DeletePost(post.id)}}/>
              <FontAwesomeIcon icon={faPencil} onClick={()=>{setOpen(true); setPostId(post.id)}} className='text-xl cursor-pointer pe-4'/>
            </div>
          </div>
          <p className="mb-4">{post.content}</p>
          {post.image ?
            <img
              src={post.image as string}
              alt=""
              className='w-full' />
            :
            ""
          }
          <div className="flex items-center space-x-4 text-gray-500 mt-5">
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <span>View Comment ({post.commentCount})</span>
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

function PostCom() {

  const posts = use(postData) as Post[]
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState<number>();

  function CloseModel() {
    setIsOpen(false)
  }

  return (
    <>
      <EditPostModal isOpen={isOpen} onClose={CloseModel} postId={postId}/>
      {posts.length < 1 ?
        <p className='text-center text-slate-500'>No Post Found</p>
        :
        <PostCard posts={posts} setPostId={setPostId} setOpen={setIsOpen}/>
      }
    </>
  )
}

export default function Profile() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }>
      <ProfileInfo />
      <Suspense>
        <div className='max-w-4xl mx-auto grid gap-5 p-4'>
          <PostCom />
        </div>
      </Suspense>
    </Suspense>
  );
}