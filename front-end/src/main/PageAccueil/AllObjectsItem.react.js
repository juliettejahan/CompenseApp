import React from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import styles from '../Stylesheet';
import emprunt from '../boutons/emprunt';
import { baseUrl } from '../../common/const';
import { useContext } from 'react';
import AppContext from '../../common/AppContext.react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

/**
 * @typedef {{oid: integer, onom: string, picture, owner: string}} Object
 * @param {Object, token} item
 */
export default function AllObjectsItem({ item, token }) {
  const { reload, setReload } = useContext(AppContext);

  const show_notif = () => Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Demande envoyée !',
    textBody: 'Le propriétaire a été notifié',
    button: 'Fermer',
  });

  const set_emprunter = () => Alert.alert('Vous voulez emprunter ce.tte ' + item.onom + ' appartenant à ' + item.owner + '.', ' Souhaitez-vous continuer ?', [
    {
      text: 'Annuler',
      onPress: () => console.log('Cancel Pressed'),
      style: 'Annuler',
    },
    { text: 'OK', onPress: () => { emprunt(item.oid, token); show_notif(); reload_func(); } },
  ]);

  let reload_func = () => { setReload(!reload); }
  return (

    <View style={[styles.item_AO, { flexDirection: "row" }]}>
      <View style={{ flex: 1 }}>
        {item.pictures != null
          // We don't store the object's picture yet on the DB
          ? <Image
            style={styles.profilePictureNV}
            source={{ uri: baseUrl + item.pictures.substring(1) }}
          />
          : <Image
            style={styles.profilePictureNV}
            source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
          />
        }
      </View>
      <View style={{ flex: 1, alignContent: 'center' }}>
        <Text >{item.owner} possède {item.onom}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Button title="Faire une demande d'emprunt" color="#80aa8c" onPress={() => { set_emprunter(); }} ></Button>
      </View>


    </View>
  );
}