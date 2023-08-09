import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import KivTextInput from '../../common/KivTextInput.react';
import KivCard from '../../common/KivCard.react';
import { useContext } from 'react';
import { sendRequest } from '../../common/sendRequest';
import AppContext from '../../common/AppContext.react';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import DropDownSelectListReact from '../../common/dropDownSelectList.react';
import styles from '../Stylesheet';

/**
 * Créer un appel à expert
 */

export default function AppelExpert() {
  const [objectname, setObjectname] = useState('casserole, pelle...');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);
  const { authToken } = useContext(AppContext);

  const [selected, setSelected] = useState("Cuisine");

  const show_notif = () => Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Appel effectué !',
    textBody: 'Les experts ont été notifiés',
    button: 'Fermer',
  });

  const sendAppelExpertRequest = () => {
    setIsLoading(true);
    sendRequest('/appel_by_cnom', 'POST', { token: authToken }, (status, data) => {
      setIsLoading(false);
      if (status >= 200 && status < 300) {
        setHasFailure(false);
        show_notif();
      } else {
        setHasFailure(true);
      }
    }, () => { setIsLoading(false); setHasFailure(true) },
      { onom: objectname, cnom: selected });
    console.debug("cnom:", selected);
  }

  return (
    <AlertNotificationRoot style={{ flex: 1 }}>

      <View style={{ flex: 1, flexGrow: 3 }}>
        <KivCard>
          <View
            style={styles.titleContainer}>
            <Text
              style={styles.title}>
              Appel Experts
            </Text>
          </View>
          {hasFailure && <View style={styles.incorrectWarning}>
            <Text
              style={styles.inputLabel}>
              Something went wrong while creating the object
            </Text>
          </View>}

          <KivTextInput label="Objectname" value={objectname} onChangeText={value => setObjectname(value)} />
        </KivCard>

      </View>

      <View style={{ flex: 4 }}>
        <DropDownSelectListReact authToken={authToken} selected={selected} setSelected={setSelected} />
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="Appel Expert" disabled={isLoading} onPress={() => { sendAppelExpertRequest(); }} />
        </View>
      </View>


    </AlertNotificationRoot>
  );
}
