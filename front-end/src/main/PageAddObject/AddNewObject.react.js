import React, { useState } from 'react';
import { Button, View, Text, Image } from 'react-native';
import KivTextInput from '../../common/KivTextInput.react';
import KivCard from '../../common/KivCard.react';
import { useContext } from 'react';
import { sendRequest } from '../../common/sendRequest';
import AppContext from '../../common/AppContext.react';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { SendpicView } from '../../common/ImagePickAndSendToServer.react';
import { GetFilePhotoView } from '../../common/ImagePickAndSendToServer.react';
import DropDownSelectListReact from '../../common/dropDownSelectList.react';
import styles from '../Stylesheet';


export default function AddNewObject() {
  const [objectname, setObjectname] = useState('casserole, pelle...');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);
  const { authToken } = useContext(AppContext);
  const [fileUri, setFileUri] = useState('https://facebook.github.io/react/logo-og.png');
  const [fileName, setFileName] = useState(null);
  const [selected, setSelected] = useState("");

  const show_notif = () => Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Bravo !',
    textBody: 'Ajout d objet réussi',
    button: 'Fermer',
  });

  const sendObjectCreationRequest = () => {
    setIsLoading(true);
    sendRequest('/objet', 'POST', { token: authToken }, (status, data) => {
      setIsLoading(false);
      if (status >= 200 && status < 300) {
        setHasFailure(false);
        show_notif();
      } else {
        setHasFailure(true);
      }
    }, () => { setIsLoading(false); setHasFailure(true) },
      { onom: objectname, Categoriename: selected, pic: './static/images/' + fileName });
    console.debug("selected:", selected);
    console.debug("pic:", './static/images/' + fileName);
  }

  return (
    <AlertNotificationRoot>

      <KivCard>
        <View
          style={styles.titleContainer}>
          <Text
            style={styles.title}>
            Add object
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
      <View style={{ flex: 1 }}>
        <DropDownSelectListReact authToken={authToken} selected={selected} setSelected={setSelected} />
      </View>

      <KivCard>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <View style={{ flex: 1 }}>
            <SendpicView files={fileUri} setFiles={setFileUri} authToken={authToken} fileName={fileName} setFileName={setFileName} />
          </View>

          <View style={{ flex: 1 }}>
            <GetFilePhotoView files={fileUri} setFiles={setFileUri} authToken={authToken} fileName={fileName} setFileName={setFileName} />
          </View>

          <View style={{ flex: 1 }}>
            <Image style={styles.logoCA} source={{ uri: fileUri }} />
          </View>
        </View>
      </KivCard>
      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="Add object" color="#ff937a" disabled={isLoading} onPress={() => { sendObjectCreationRequest(); }} />
        </View>
      </View>


    </AlertNotificationRoot>
  );
}
