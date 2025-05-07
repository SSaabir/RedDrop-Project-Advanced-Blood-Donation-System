import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useDashboardData = () => {
  const { user } = useAuthContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.userObj || !user.userObj._id || !user.role) {
      return; // Wait until user is fully loaded
    }
    
    const fetchData = async () => {
      
      console.log('User data missing:', user);
      if (!user || !user.userObj._id || !user.role) {
        setError('User data missing');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/dashboard/${user.role.toLowerCase()}`, {
          params: { userId: user.userObj._id, role: user.role },
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading, error };
};