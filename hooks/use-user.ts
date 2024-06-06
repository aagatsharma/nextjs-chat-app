'use client';

import { userContext } from '@/providers/AuthProvider';
import { useContext } from 'react';

const UseUser = () => {
  return useContext(userContext);
};

export default UseUser;
