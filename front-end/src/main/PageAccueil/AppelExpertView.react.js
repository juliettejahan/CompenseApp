import React from 'react';
import { View} from 'react-native';
import AppelExpert from './AppelExpert.react';
import { useContext } from 'react';
import AppContext from '../../common/AppContext.react';
import styles from '../Stylesheet';
  
/**
 * Page d'appel à un expert
 * @param 
 * @returns
 */
export default function AppelExpertView() {
    
    const {setAuthToken, setUsername} =  useContext(AppContext);
    
    function onLogUser(username, authToken){
      setUsername(username);
      setAuthToken(authToken);
    }      

    return (
    
      <View style={[styles.mainContainer,{flexDirection: "column"}]}>
        <View style={[{flexDirection:'row',flex:1}]}>
        <AppelExpert onSuccess={onLogUser}/>
        </View>
      </View>
   
    );


}
