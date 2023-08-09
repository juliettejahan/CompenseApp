import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import KivTextInput from '../common/KivTextInput.react';
import KivCard from '../common/KivCard.react';
import { useContext } from 'react';
import { sendRequest } from '../common/sendRequest';
import AppContext from '../common/AppContext.react';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { SendpicViewRegister } from '../common/ImagePickAndSendToServer.react';
import { GetFilePhotoViewRegister } from '../common/ImagePickAndSendToServer.react';
import MultipleSelectListForExpertise from '../common/MultipleSelectListForExpertise.react';
import MultipleSelectListForGroup from '../common/MultipleSelectListForGroup.react';

const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 24,
  },
  incorrectWarning: {
    backgroundColor: '#FF8A80',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row'
  },
  button: {
    flexGrow: 1,
    padding: 2
  },
  logo: {
    alignItems: 'center',
    width: 100,
    height: 100,
  },
});

export default function CreateAccount({ route, onSuccess, onCancel }) {
  const [username, setUsername] = useState('newUser');
  const [password, setPassword] = useState('bien');
  const [email, setEmail] = useState('calvin@klein.com');
  const [mobile, setMobile] = useState('0608453267');
  const [unom, setUnom] = useState('nom');
  const [prenom, setPrenom] = useState('prenom');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);
  const { setAuthToken } = useContext(AppContext);
  const [fileName, setFileName] = useState(null);
  const [fileUri, setFileUri] = useState('https://facebook.github.io/react/logo-og.png');
  const [selected, setSelected] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState([]);



  const show_notif = () => Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Réussi à sign up!',
    textBody: 'Congrats! ',
    button: 'close',
  });

  const sendUserCreationRequest = () => {
    setIsLoading(true);
    sendRequest('/register', 'POST', null, (status, data) => {
      setIsLoading(false);
      if (status >= 200 && status < 300) {
        setHasFailure(false);
        show_notif();
        onSuccess();
      } else {
        setHasFailure(true);
      }
    }, () => { setIsLoading(false); setHasFailure(true) },
      { login: username, password: password, email: email, mobile: mobile, unom, prenom, pictures: './static/imagesRegister/' + fileName, expertises: selected, selectedGroup: selectedGroup });
    console.debug("pic:", './static/imagesRegister/' + fileName);
  }

  return (
    <AlertNotificationRoot>
      <ScrollView>

        <KivCard>

          <View
            style={styles.titleContainer}>
            <Text
              style={styles.title}>
              Create Account
            </Text>
          </View>
          {hasFailure && <View style={styles.incorrectWarning}>
            <Text
              style={styles.inputLabel}>
              Something went wrong while creating the user
            </Text>
          </View>}
          <View >
            <KivTextInput label="Username" value={username} onChangeText={value => setUsername(value)} />
            <KivTextInput label="Password" value={password} onChangeText={value => setPassword(value)} />
            <KivTextInput label="Email" value={email} onChangeText={value => setEmail(value)} />
            <KivTextInput label="Mobile" value={mobile} onChangeText={value => setMobile(value)} />
            <KivTextInput label="Nom" value={unom} onChangeText={value => setUnom(value)} />
            <KivTextInput label="Prénom" value={prenom} onChangeText={value => setPrenom(value)} />
            <MultipleSelectListForExpertise selected={selected} setSelected={setSelected} />
            <MultipleSelectListForGroup selected={selectedGroup} setSelected={setSelectedGroup} />

          </View>
          <View style={{ flexDirection: 'row', padding: 10, width: 700 }}>

            <View style={{ flex: 1 }}>
              <SendpicViewRegister files={fileUri} setFiles={setFileUri} fileName={fileName} setFileName={setFileName} />
            </View>

            <View style={{ flex: 1 }}>
              <GetFilePhotoViewRegister files={fileUri} setFiles={setFileUri} fileName={fileName} setFileName={setFileName} />
            </View>

            <View style={{ flex: 1 }}>
              <Image style={styles.logo} source={{ uri: fileUri }} />
            </View>

          </View >
          <View style={{ flex: 1 }}>
            <View style={styles.buttonRow}>
              <View style={styles.button}>
                <Button title="< Login" disabled={isLoading} onPress={() => { onCancel(); }} />
              </View>
              <View style={styles.button}>
                <Button title="Create Account" disabled={isLoading} onPress={() => { sendUserCreationRequest(); }} />
              </View>
            </View>
          </View>

        </KivCard>
      </ScrollView>
    </AlertNotificationRoot>
  );
}
