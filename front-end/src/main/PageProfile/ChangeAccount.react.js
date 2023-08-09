import React, { useState } from 'react';
import { Button, View, Text, Image, ScrollView } from 'react-native';
import KivTextInput from '../../common/KivTextInput.react';
import KivCard from '../../common/KivCard.react';
import { useContext } from 'react';
import styles from '../Stylesheet';
import { sendRequest } from '../../common/sendRequest';
import AppContext from '../../common/AppContext.react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { SendpicViewRegister } from '../../common/ImagePickAndSendToServer.react';
import { GetFilePhotoViewRegister } from '../../common/ImagePickAndSendToServer.react';
import MultipleSelectListForExpertise from '../../common/MultipleSelectListForExpertise.react';
import MultipleSelectListForGroup from '../../common/MultipleSelectListForGroup.react';


export default function ChangeAccount({ onSuccess }) {
  const [password, setPassword] = useState('bien');
  const [email, setEmail] = useState('calvin@klein.com');
  const [mobile, setMobile] = useState('0608453267');
  const [unom, setUnom] = useState('nom');
  const [prenom, setPrenom] = useState('prenom');
  const [expertises, setExpertises] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);
  const { authToken, setAuthToken } = useContext(AppContext);
  const [fileName, setFileName] = useState(null);
  const [fileUri, setFileUri] = useState('https://facebook.github.io/react/logo-og.png');
  const [selectedGroup, setSelectedGroup] = React.useState([]);

  const show_notif = () => Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Bravo!',
    textBody: 'Authentification réussie',
    button: 'close',
  });

  const sendUserChangeRequest = () => {
    setIsLoading(true);
    sendRequest('/Auth_all_info', 'PATCH', { token: authToken }, (status, data) => {
      setIsLoading(false);
      if (status >= 200 && status < 300) {
        setHasFailure(false);
        onSuccess();
      } else {
        setHasFailure(true);
      }
    }, () => { setIsLoading(false); setHasFailure(true) },
      { password: password, email: email, mobile: mobile, unom: unom, prenom: prenom, pictures: './static/imagesRegister/' + fileName, expertises: expertises, groups: selectedGroup });
    console.debug("pic:", './static/imagesRegister/' + fileName);
  }

  return (
    <ScrollView>
      <View style={{ maxWidth: 700, minWidth: 500 }}>
        <KivCard>

          <View
            style={styles.titleContainer}>
            <Text
              style={styles.titleCA}>
              Change Profile
            </Text>
          </View>
          {hasFailure && <View style={styles.incorrectWarning}>
            <Text
              style={styles.inputLabel}>
              Something went wrong while creating the user
            </Text>
          </View>}

          <KivTextInput style={styles.inputLabel} label={<Text style={styles.inputTitle}>Password</Text>} value={password} secureTextEntry={true} onChangeText={value => setPassword(value)} />
          <KivTextInput style={styles.inputLabel} label={<Text style={styles.inputTitle}>Email</Text>} value={email} onChangeText={value => setEmail(value)} />
          <KivTextInput style={styles.inputLabel} label={<Text style={styles.inputTitle}>Mobile</Text>} value={mobile} onChangeText={value => setMobile(value)} />
          <KivTextInput style={styles.inputLabel} label={<Text style={styles.inputTitle}>Nom</Text>} value={unom} onChangeText={value => setUnom(value)} />
          <KivTextInput style={styles.inputLabel} label={<Text style={styles.inputTitle}>Prénom</Text>} value={prenom} onChangeText={value => setPrenom(value)} />
          <MultipleSelectListForExpertise selected={expertises} setSelected={setExpertises} />
          <MultipleSelectListForGroup selected={selectedGroup} setSelected={setSelectedGroup} />


          <View style={{ flexDirection: 'row', padding: 10 }}>

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

            <Button title="Change Profile" color="#ff937a" disabled={isLoading} onPress={() => { sendUserChangeRequest(); }} />

          </View>

        </KivCard>
      </View>
    </ScrollView>
  );
}
