import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';

// Custom hook for handling logout
export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {

    const apiLink = import.meta.env.VITE_API_LINK;

    try {
      // First, call your logout endpoint if you have one
      await axios.get(apiLink+'/logout', {
        withCredentials: true
      });
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
      console.error('Logout error:', error);
      
      // Even if the logout API fails, we still want to clear cookies and redirect
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      
      navigate('/login');
    }
  };

  return handleLogout;
};
