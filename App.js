import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {AuthContext} from './src/API_Services/Context';
import Splash from './src/screens/Stack/splashScreen';
import AuthNavigations from './src/routes/AuthNavigations';
import AppNavigation from './src/routes/AppNavigation';

export default function App() {
  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (token, details) => {
        const userToken = token;
        try {
          await AsyncStorage.setItem('userToken', userToken);
          dispatch({type: 'LOGIN', token: userToken});
        } catch (e) {
          console.log(e);
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('token');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token !== null) {
          dispatch({type: 'RETRIEVE_TOKEN', token: token});
        } else {
          dispatch({type: 'LOGOUT'});
        }
      } catch (e) {
        console.log(e);
      }
    }, 3000);
  }, []);

  if (loginState.isLoading) {
    return <Splash />
  }

  return (
    <AuthContext.Provider value={authContext}>
      {loginState.userToken !== null ? <AppNavigation /> : <AuthNavigations />}
      <Toast position="top" topOffset={40} />
    </AuthContext.Provider>
  );
}
