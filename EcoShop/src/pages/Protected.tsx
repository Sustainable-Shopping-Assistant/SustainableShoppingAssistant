import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Protected: React.FC = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('jwt');

        if (!token) {
          throw new Error('No token found');
        }

        const res = await axios.get('/api/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data } = res;

        setData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <p>Protected data: {data}</p>;
};

export default Protected;
