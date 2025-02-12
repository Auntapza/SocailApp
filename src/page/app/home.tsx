import React, { Dispatch, SetStateAction, Suspense, use, useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faUser } from '@fortawesome/free-solid-svg-icons';
import CreatePostModal from '../../components/CreatePostPopup';

const accountData = fetchAccountData()
const postData = fetchPost();

async function fetchAccountData() {
  const apiLink = import.meta.env.VITE_API_LINK
  const res = await axios.get(apiLink+"/account", {
    withCredentials: true,
  });
  return res.data;
}

async function fetchPost() {
  const apiLink = import.meta.env.VITE_API_LINK
  const res = await axios.get(apiLink+"/post")
  return res.data
}

function CreatePostComponent({ setOpen }: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) {

  const account = use(accountData)

  function open() {
    setOpen(true)
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-2">
          {account.profile_img == null ?
            <FontAwesomeIcon icon={faUser} className='size-10 my-3' />
            :
            <img
              src={account.profile_img}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          }
          <span
            onClick={open}
            className="flex-1 bg-gray-100 flex items-center text-gray-400 cursor-pointer rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >What is your mind?</span>
        </div>
        <div className='flex justify-center items-center mt-5'>
          <span
            onClick={open}
            className='cursor-pointer border border-slate-100 rounded p-3'
          ><FontAwesomeIcon icon={faImage} className='mx-3' />Photo</span>
        </div>
      </div>
    </>
  )
}

const App: React.FC = () => {

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <CreatePostModal isOpen={open} onClose={() => { setOpen(false) }} />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto pt-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Sidebar />
          {/* Main Feed */}
          <div className="md:col-span-2 space-y-4">

            {/* Create Post */}
            <CreatePostComponent setOpen={setOpen} />

            {/* Posts */}
            <Suspense fallback={<p className='text-center text-slate-500'>Loadding...</p>}>
              <PostCom />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

function Post({ posts }: {
  posts: Post[]
}) {

  return (
    <>
      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            {post.user.avatar ?
            <img
              src={post.user.avatar as string}
              alt={post.user.name}
              className="w-10 h-10 rounded-full"
            />
            :
            <FontAwesomeIcon icon={faUser} className='w-10 h-10 rounded-full'/>
            }
            <div>
              <h3 className="font-semibold">{post.user.name}</h3>
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
          <div>test</div>
        </div>
      ))}
    </>
  )
}

function PostCom() {

  const posts = use(postData) as Post[]

  return (
    <>
      {posts.length < 1 ?
        <p className='text-center text-slate-500'>No Post Found</p>
        :
        <Post posts={posts} />
      }
    </>
  )
}

export interface Post {
  id: number;
  user: {
    name: string;
    avatar: string | null;
  };
  content: string | null;
  image: string | null
  commentCount: number;
}

export default App;