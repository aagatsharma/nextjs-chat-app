'use client';

import { User } from '@prisma/client';
import { createContext } from 'react';

type UserWithoutP = Omit<User, 'hashedPassword'> | null;

type Authprops = {
  children: React.ReactNode;
  currentUser: UserWithoutP;
};

export const userContext = createContext<UserWithoutP>(null);

const AuthProvider: React.FC<Authprops> = ({ children, currentUser }) => {
  return (
    <userContext.Provider value={currentUser}>{children}</userContext.Provider>
  );
};

export default AuthProvider;
