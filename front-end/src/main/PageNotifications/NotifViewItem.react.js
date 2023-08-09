import { useContext } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import styles from '../Stylesheet';
import Accepter from '../boutons/accepter';
import Refuser from '../boutons/refuser';
import Recuperer from '../boutons/recuperer';
import AppContext from '../../common/AppContext.react';

/**
 * @typedef {{oid: integer, onom: string, picture, owner: string}} Object
 * @param {Object} item
 * @param navigation
 * @param {string} token
 */ 

const show_notif_reussi = () => Dialog.show({
  type: ALERT_TYPE.SUCCESS,
  title: 'Bravo !',
  textBody: 'L`opération est réussie ! ',
  button: 'close',
});

export default function NotifViewItem({ item, token, navigation }) {
  const { masked, setMasked } = useContext(AppContext);
  const show_notif = () => Alert.alert('Ajout d un objet', 'Vous avez signalé posséder l objet demandé, souhaitez-vous continuer en l ajoutant à votre catalogue et en le prêtant au donneur ?', [
    {
      text: 'Annuler',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => { setMasked([...masked, item.onom]); navigation.navigate('AddObjectView') } },
  ]);

  console.debug("masked:", masked);


  const set_masked = () => Alert.alert('Aide impossible', 'Vous avez signalé ne pas posséder l objet demandé, confirmez-vous ?', [
    {
      text: 'Annuler',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => { setMasked([...masked, item.onom]); show_notif_reussi() } },
  ]);



  console.log(`Bearer 2 ${token}`)
  return (


    <View id={item.onom} style={[styles.item, { flexDirection: "row" }]}>

      <View style={{ flex: 1 }}>
        <Text style={styles.item_content}>{item.onom}</Text>
      </View>


      <View style={{ flex: 1 }}>
        <Text style={styles.item_content} >{item.date_appel}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Button color="#ff937a" title="J'ai" onPress={show_notif}></Button>
      </View>

      <View style={{ flex: 1 }}>
        <Button title="Je n'ai pas" color="#ff937a" onPress={set_masked}></Button>
      </View>


    </View>
  );

}

export function NotifViewItem2({ item, token }) {
  console.log(`Bearer 2 ${token}`)

  const set_accpeter = () => Alert.alert('Accepter la demande', 'Vous avez signalé accepter la demande de prêt, confirmez-vous ?', [
    {
      text: 'Refuser',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => { Accepter(item.oid, token); show_notif_reussi() } },
  ]);

  const set_refuser = () => Alert.alert('Refuser la demande', 'Vous avez signalé refuser la demande de prêt, confirmez-vous ?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => { Refuser(item.oid, token); show_notif_reussi() } },
  ]);

  return (

    <View style={[styles.item, { flexDirection: "row" }]}>

      <View style={{ flex: 1 }}>
        <Text style={styles.item_content} >{item.onom}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.item_content} >Demandé.e par {item.demandeur}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.item_content} >{item.debut}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Button title="J'accepte" color="#ff937a" onPress={() => { set_accpeter() }}></Button>
      </View>

      <View style={{ flex: 1 }}>
        <Button title="Je refuse" color="#ff937a" onPress={() => { set_refuser() }}></Button>
      </View>


    </View>
  );
}


export function NotifViewItem3({ item, token }) {
  console.log(`Bearer 2 ${token}`)
  const set_recuperer = () => Alert.alert('Récupération effectuée', 'Vous avez signalé d`avoir récupéré l`objet que vous avez demandé, confirmez-vous ?', [
    {
      text: 'Fermer',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => { Recuperer(item.oid, token); show_notif_reussi(); } },
  ]);
  return (


    <View style={[styles.item, { flexDirection: "row" }]}>

      <View style={{ flex: 1 }}>
        <Text style={styles.item_content} >{item.onom}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.item_content} >A récupérer auprès de {item.propriétaire}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Button title="J'ai récupéré" color="#ff937a" onPress={() => { set_recuperer() }}></Button>
      </View>

    </View>
  );
}
