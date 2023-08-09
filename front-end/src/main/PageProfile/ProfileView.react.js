import React, { useState } from 'react';
import { View } from 'react-native';
import ProfileChange from './ChangeProfileView.react';
import { useContext } from 'react';
import AppContext from '../../common/AppContext.react';
import Caracteristiques from './Caracteristiques.react';
import styles from '../Stylesheet';
/**
 *
 * @param navigation
 * @returns
 */


export default function ProfileView({ navigation }) {
  const [profileChangeView, setProfileChangeView] = useState(false);
  const [profile, setProfile] = useState();
  const { authToken } = useContext(AppContext);


  if (profileChangeView) {
    return (
      <View>
        <ProfileChange profile={profile} setProfile={setProfile} logoutUser={logoutUser} profileChangeView={profileChangeView} setProfileChangeView={setProfileChangeView} />
      </View>
    );
  }
  else {
    return (

      <View style={[styles.mainContainer, { flexDirection: "column" }]}>

        <View style={[{ flex: 1 }, { flexDirection: 'column' }]}>
          <Caracteristiques authToken={authToken} navigation={navigation} />
        </View>

      </View>


    );
  }


}
