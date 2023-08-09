import React from 'react';
import Root from './src/Root.react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddObjectView from './src/main/PageAddObject/AddNewObject.react';
import CreateAccount from './src/loggedOut/CreateAccount.react';
import AppelExpertView from './src/main/PageAccueil/AppelExpertView.react';
export const UserContext = React.createContext();
import { useState } from 'react';
import AppContext from './src/common/AppContext.react';
import ChangeProfileView from './src/main/PageProfile/ChangeProfileView.react';

const Stack = createNativeStackNavigator();


export default function App() {


  const [authToken, setAuthToken] = useState(null);
  const [reload, setReload] = useState(false);
  const [numNotif, setNumnotif] = useState(4);
  const [masked, setMasked] = useState([]);
  const [content, setContent] = useState("louche");
  const [onomMask, setOnomMask] = useState("");

  const logoutUser = () => {
    setUsername(null);
    setAuthToken(null);
  };
  const [username, setUsername] = useState(null);
  const onSuccess = () => {
    setTab(TABS.LOGIN)
  };
  const onLogUser = (username, authToken) => {
    setUsername(username);
    setAuthToken(authToken);
  };

  return (
    <AppContext.Provider value={{
      authToken, setAuthToken,
      logoutUser,
      username, setUsername,
      onSuccess, onLogUser,
      reload, setReload,
      numNotif, setNumnotif,
      masked, setMasked,
      content, setContent,
      onomMask, setOnomMask,
    }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Root" screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }} >
          <Stack.Screen name="Root" component={Root} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="AddObjectView" component={AddObjectView} />
          <Stack.Screen name="ChangeProfileView" component={ChangeProfileView} />
          <Stack.Screen name="AppelExpertView" component={AppelExpertView} />
        </Stack.Navigator>

      </NavigationContainer>
    </AppContext.Provider>

  );
}

