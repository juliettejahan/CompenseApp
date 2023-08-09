import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import LoggedOutView from './loggedOut/LoggedOutView.react';
import AppContext from './common/AppContext.react';
import Bar from './main/MenuBar.react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    width: '100%',
    height: '100%',
  }
});

export default function Root({ navigation }) {

  const { authToken, onLogUser } = useContext(AppContext);


  onCancel = () => {
    setTab(TABS.LOGIN)
  }

  return (
    <View>

      <View style={styles.container}>
        {authToken != null
          ? <Bar navigation={navigation} />

          : <LoggedOutView onLogUser={onLogUser} />}

      </View>
    </View>
  );
}
