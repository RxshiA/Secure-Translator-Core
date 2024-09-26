/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/api';
import BrowserStorage from '../helper/BrowserStorage';

const TokenVerifier = () => {
  const navigate = useNavigate();
  const token = BrowserStorage.getLocalStorage('token');

  useEffect(() => {
    const verify = async () => {
      if (token) {
        try {
          const response = await verifyToken(token);
          if (response.data.status !== 'ok') {
            BrowserStorage.removeLocalStorage('loggedIn');
            BrowserStorage.removeLocalStorage('token');
            navigate('/login');
          }
        } catch (error) {
          BrowserStorage.removeLocalStorage('loggedIn');
          BrowserStorage.removeLocalStorage('token');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    verify();
  }, [token, navigate]);

  return null;
};

export default TokenVerifier;