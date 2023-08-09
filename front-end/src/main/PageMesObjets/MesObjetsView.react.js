import React from 'react';
import { View } from 'react-native';
import { useContext } from 'react';
import AppContext from '../../common/AppContext.react';
import Catalogue from './catalogue.react';
import styles from '../Stylesheet';

/**
 * Page showing all the objects of the current user
 */

export default function MesObjetsView() {

  const { authToken } = useContext(AppContext);




  return (

    <View style={[styles.mainContainer, { flexDirection: "column" }]}>

      <View style={[{ flex: 1, flexDirection: 'column' }]}>
        <Catalogue authToken={authToken} />
      </View>

    </View>

  );



}
