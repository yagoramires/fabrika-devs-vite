/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import db from '../firebase/config';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
  signOut,
} from 'firebase/auth';

import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const auth = getAuth();

  // Cleanup
  const [cancelled, setCancelled] = useState(false);

  const checkCancelled = () => {
    if (cancelled) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  };

  // Register
  const createUser = async (data) => {
    checkCancelled();
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, { displayName: data.displayName });
      setLoading(false);
      return user;
    } catch (error) {
      let systemErrorMsg;

      if (error.message.includes('Password')) {
        systemErrorMsg = 'A senha precisa ter pelo menos 6 caracteres.';
      } else if (error.message.includes('email-already')) {
        systemErrorMsg = 'E-mail já cadastrado.';
      } else {
        systemErrorMsg = 'Ocorreu um erro, tente novamente mais tarde.';
      }
      setError(systemErrorMsg);
      setLoading(false);
    }
  };

  // logout
  const logout = () => {
    checkCancelled();
    signOut();
  };

  useEffect(() => {
    return () => {
      setCancelled(true);
    };
  }, []);

  return {
    auth,
    createUser,
    error,
    loading,
    logout,
  };
};
