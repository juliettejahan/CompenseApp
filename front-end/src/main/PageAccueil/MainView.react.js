import { View } from 'react-native';
import AllObjects from './AllObjects.react';
// Import Image Picker
import * as React from 'react';
import { useContext, useState } from 'react';
import AppContext from '../../common/AppContext.react';
import styles from '../Stylesheet';
import { AlertNotificationRoot } from 'react-native-alert-notification';

/**
 * Main page
 * @param navigation to navigate through the pages
 * @returns
 */
export default function MainView({ navigation }) {
  const { authToken } = useContext(AppContext);
  return (
    <AlertNotificationRoot>
      <View style={styles.mainContainer}>
        <View
          style={styles.cardContainer}>
          <AllObjects authToken={authToken} navigation={navigation} />
        </View>
      </View>
    </AlertNotificationRoot>
  );
}


