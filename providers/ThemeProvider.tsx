'use client';

import { Dispatch, SetStateAction, createContext, useState } from 'react';

type Authprops = {
  children: React.ReactNode;
};

export const themeContext = createContext<{
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
} | null>(null);

const ThemeProvider: React.FC<Authprops> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <themeContext.Provider value={{ darkMode, setDarkMode }}>
      {/* <div
        className={
          darkMode
            ? 'dark theme bg-background-dark text-text-dark'
            : 'theme bg-background-light text-text-light'
        }
      > */}
      {children}
      {/* </div> */}
    </themeContext.Provider>
  );
};

export default ThemeProvider;
