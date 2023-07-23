import './App.scss';
import React, {useState} from 'react';
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import Login from "./Pages/Login";
import Converter from "./Pages/Converter";
const APP_ID = process.env.REACT_APP_REALM_APP_ID;

const RequireLoggedInUser = ({ children }) => {
  const app = useRealmApp();
  return app.currentUser ? children : <Login />;
};

const App = () => {
  return (
    <RealmAppProvider appId={APP_ID}>
      <RequireLoggedInUser>
        <Converter />
      </RequireLoggedInUser>
    </RealmAppProvider>
    
  );
}

export default App;
