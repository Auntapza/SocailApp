import React, { Dispatch, SetStateAction, Suspense, use, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faUser } from '@fortawesome/free-solid-svg-icons';
import CreatePostModal from '../../components/CreatePostPopup';
import toast from 'react-hot-toast';
import apiLink from '../../lib/apilink';
import navigate from '../../lib/navigate';

const accountData = fetchAccountData()
const postData = fetchPost();

async function fetchAccountData() {
  const apiLink = import.meta.env.VITE_API_LINK
  const res = await axios.get(apiLink + "/account", {
    withCredentials: true,
  });
  return res.data;
}

async function fetchPost() {
  const apiLink = import.meta.env.VITE_API_LINK
  const res = await axios.get(apiLink + "/post")
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

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string | null;
  };
  content: string;
  createdAt: string;
}

export interface Post {
  id: number;
  user: {
    name: string;
    avatar: string | null;
  };
  content: string | null;
  image: string | null;
  commentCount: number;
  comments: Comment[];
  createdAt: string;
}


const Post = ({ posts, setPosts }: { posts: Post[], setPosts: React.Dispatch<React.SetStateAction<Post[]>> }) => {
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const nav = navigate()
    const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleSubmitComment = async (postId: number) => {
    const commentDetail = commentInputs[postId];
    
    if (!commentDetail?.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axios.post(`${apiLink}/comment/${postId}`, {
        commentDetail
      }, {withCredentials: true});

      // Clear input
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ''
      }));

      // Update post comment count
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentCount: post.commentCount + 1
            };
          }
          return post;
        })
      );

      toast.success('Comment posted successfully!');
      nav(0);
      
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex items-center space-x-2 mb-4">
            {post.user.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <h3 className="font-semibold">{post.user.name}</h3>
              <p className="text-sm text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          
          <p className="mb-4">{post.content}</p>
          
          {post.image && (
            <img
              src={post.image}
              alt=""
              className="w-full rounded-lg mb-4"
            />
          )}

          <div className="flex items-center space-x-4 text-gray-500 mt-5">
            <button 
              onClick={() => toggleComments(post.id)}
              className="flex items-center space-x-1 hover:text-blue-500"
            >
              <span>
                {expandedComments.includes(post.id) ? 'Hide' : 'View'} Comments ({post.commentCount})
              </span>
            </button>
          </div>

          {expandedComments.includes(post.id) && (
            <div className="mt-4 space-y-4">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {comment.user.avatar ? (
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faUser} className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <h4 className="font-medium text-sm">{comment.user.name}</h4>
                        <p className="text-xs text-gray-500">{comment.createdAt}</p>
                      </div>
                    </div>
                    <p className="text-sm ml-10">{comment.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </div>
              )}
              
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <button 
                  onClick={() => handleSubmitComment(post.id)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

function PostCom() {

  const [, setPost] = useState<Post[]>([]);
  const posts = use(postData) as Post[]

  return (
    <>
      {posts.length < 1 ?
        <p className='text-center text-slate-500'>No Post Found</p>
        :
        <Post posts={posts} setPosts={setPost}/>
      }
    </>
  )
}

export default App;