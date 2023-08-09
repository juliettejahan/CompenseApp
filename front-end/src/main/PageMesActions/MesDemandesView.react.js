import React from 'react';
import { View } from 'react-native';
import { useContext } from 'react';
import AppContext from '../../common/AppContext.react';
import MesActions from './MesActions.react';
import styles from '../Stylesheet';

/**
 *
 * @param {string} authToken authToken for the authenticated queries
 * @param {()=>{}} logOutUser return to the logged out state
 * @returns
 */
export default function MesDemandesView() {
  const { authToken } = useContext(AppContext);



  return (

    <View style={[styles.mainContainer, { flexDirection: "column" }]}>

      <View style={[{ flex: 1, flexDirection: 'column' }]}>
        <MesActions authToken={authToken} />
      </View>


    </View>

  );


}
