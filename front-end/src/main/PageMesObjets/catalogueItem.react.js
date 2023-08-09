import React from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import KivCard from '../../common/KivCard.react';
import { baseUrl } from '../../common/const';
import Rendu from '../boutons/rendu';
import styles from '../Stylesheet';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
/**
 * @typedef {{dispo: int, onom: string, picture, owner: string}} Object
 * @param {Object} item
 * @param {int (0, 1, 2, 3)} filtre_dispo
 * @param {string} token
 */



export default function CatalogueItem({ item, filtre_dispo, token }) {

  const show_notif = () => Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Etat changé !',
    textBody: 'Ton' + item.onom + ' a déjà noté comme rendu! ',
    button: 'close',
  });

  const set_rendu = () => Alert.alert('Le(a) emprunteur(se) déjà rendu l`objet ?', 'Vous avez signalé que le(a) emprunteur(se) déjà redu l`objet que vous avez prêté, souhaitez-vous continuer ?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => { Rendu(item.oid, token); show_notif(); } },
  ]);

  if (filtre_dispo == 3) {
    return (
      <AlertNotificationRoot>
        <KivCard>
          <View style={[{ flexDirection: 'row' }]}>
            <View style={{ flex: 1 }}>
              {item.pictures != null
                // We don't store the object's picture yet on the DB
                ? <Image
                  style={styles.logo}
                  source={{ uri: baseUrl + item.pictures.substring(1) }}
                />
                : <Image
                  style={styles.logo}
                  source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
                />
              }
            </View>

            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={[styles.default, { flex: 1 }]}>
                {item.onom}
              </Text>
              <Text style={[styles.default, { flex: 1 }]}>
                {item.preteur}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Button title='rendu' color="#ff937a" onPress={() => { set_rendu() }}></Button>
            </View>
          </View>
        </KivCard>
      </AlertNotificationRoot>);
  }
  else {
    return (
      <AlertNotificationRoot>
        <KivCard>
          <View style={[{ flexDirection: 'row' }]}>
            <View style={{ flex: 1 }}>
              {item.pictures != null
                // We don't store the object's picture yet on the DB
                ? <Image
                  style={styles.logo}
                  source={{ uri: baseUrl + item.pictures.substring(1) }}
                />
                : <Image
                  style={styles.logo}
                  source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
                />
              }
            </View>

            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={[styles.default, { flex: 1 }]}>
                {item.onom}
              </Text>
              <Text style={[styles.default, { flex: 1 }]}>
                {item.preteur}
              </Text>
            </View>

          </View>
        </KivCard>
      </AlertNotificationRoot>);
  }
}

