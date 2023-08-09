import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { sendRequest } from '../common/sendRequest';
import KivTextInput from '../common/KivTextInput.react';
import KivCard from '../common/KivCard.react';

const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 36,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 30,
  },
  inputTitle: {
    textAlign: 'center',
    fontSize: 29,
    fontFamily: "sans-serif",
    color: "#2f4a48",
    fontWeight: "normal",
    fontVariant: "small-caps",
  },
  inputLabel: {
    textAlign: 'left',
    backgroundColor: '#fff3ed',
    fontSize: 20,
    fontFamily: "sans-serif",
    color: "#2f4a48",
    fontWeight: "normal",
    fontVariant: "oldstyle-nums",
    textShadowColor: "#ff937a",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0.5,
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
});

/**
 * Login component with User & Password
 * @param {(username:string, authToken:string) => {}} onSuccess
 * @param {() => {}} onCancel
 */
export default function Login({ onSuccess, onCancel }) {
  const [username, setUsername] = useState('calvin');
  const [password, setPassword] = useState('hobbes');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInvalidLogin, setHasInvalidLogin] = useState(false);


  const sendLoginRequest = () => {
    setIsLoading(true);
    sendRequest('/login', 'GET', { login: username, password: password }, (status, data) => {
      setIsLoading(false);
      if (status == 200) {
        setHasInvalidLogin(false);
        onSuccess(username, data);
      } else {
        setHasInvalidLogin(true);
      }
    }, () => { setIsLoading(false); setHasInvalidLogin(true) });
  };
  return (
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          Login
        </Text>
      </View>
      {hasInvalidLogin && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          The username or password is incorrect
        </Text>
      </View>}
      <KivTextInput label="Username" style={styles.inputLabel} value={username} onChangeText={value => setUsername(value)} />
      <KivTextInput secureTextEntry={true} label="Password" style={styles.inputLabel} value={password} onChangeText={value => setPassword(value)} />
      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="< Create Account" color="#ff937a" disabled={isLoading} onPress={() => { onCancel(); }} />
        </View>
        <View style={styles.button}>
          <Button title="Login" color="#ff937a" disabled={isLoading} onPress={() => { sendLoginRequest(); }} />
        </View>
      </View>
    </KivCard>
  );
}
