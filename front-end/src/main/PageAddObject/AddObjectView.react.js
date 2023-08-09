import React from 'react';
import { View } from 'react-native';
import AddNewObject from './AddNewObject.react.js'
import { useContext } from 'react';
import AppContext from '../common/AppContext.react';
import styles from './Stylesheet';



/**
 *
 * @returns
 */
export default function AddObjectView() {

  const { setAuthToken, setUsername } = useContext(AppContext);

  function onLogUser(username, authToken) {
    setUsername(username);
    setAuthToken(authToken);
  }

  return (

    <View style={[styles.mainContainer, { flexDirection: "column" }]}>
      <View style={[{ flexDirection: 'column' }]}>
        <AddNewObject onSuccess={onLogUser} />
      </View>
    </View>

  );


}
