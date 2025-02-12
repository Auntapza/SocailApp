import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Post } from '../page/app/home';
import { useNavigate } from 'react-router';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number | undefined
}

const EditPostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, postId }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Post>();
  const navigate = useNavigate()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    async function fetchPostData() {

        const apiLink = import.meta.env.VITE_API_LINK;

        if (postId) {
            const res = await axios.get(apiLink+'/post/'+postId);
            setData(res.data);
            console.log(res.data);
        }
    }
    fetchPostData();
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const apiLink = import.meta.env.VITE_API_LINK

      await axios.put(apiLink+'/post/'+postId, {
        postDes: data?.content,
        postImg: imagePreview?.split(',')[1] // Remove data:image/jpeg;base64, prefix
      }, {
        withCredentials: true
      });
      
      toast.success('Post Update successfully!');
      onClose();
      setImagePreview(null);
      navigate(0)
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#62748e44] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Post content</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="What's on your mind?"
            value={data?.content as string}
            onChange={(e) => setData((prv:any) => {
                return {
                    ...prv,
                    content: e.target.value
                }
            })}
            className="w-full p-2 border border-gray-300 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-2 cursor-pointer border-2 border-dashed border-gray-300 rounded hover:border-blue-500 focus:outline-none"
            >
              {imagePreview ? 'Change Image' : 'Add Image'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit!
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;