import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, SectionList } from 'react-native';
import KivCard from '../../common/KivCard.react';
import NotifViewItem from './NotifViewItem.react';
import { NotifViewItem2, NotifViewItem3 } from './NotifViewItem.react';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../../common/const';
import AppContext from '../../common/AppContext.react';
import styles from '../Stylesheet';
import { AlertNotificationRoot } from 'react-native-alert-notification';


/**
 * Notification page
 */
export default function NotifView({ navigation }) {
  const { authToken, setNumnotif } = useContext(AppContext);
  const { masked } = useContext(AppContext);
  let objects;
  let objects_notif;
  let objects_notif_recuperer;
  const fetcher = async (url) => {
    const res = await axios.get(baseUrl + url,
      { headers: { Authorization: `Bearer ${authToken}` } });
    return res.data;
  }


  const { data, error, isLoading, mutate } = useSWR("/appel_notif", fetcher, { refreshInterval: 10000 });
  console.debug('data_notif:', data);
  console.debug('type_data_notif:', typeof (data));

  const { data: data_action_notif, error: error_action_notif, isLoading: isLoading_action_notif, mutate: mutate_action_notif } = useSWR("/action_notif", fetcher, { refreshInterval: 10000 });
  console.debug('data_action_notif:', data_action_notif);

  const { data: data_action_recuperer, error: error_action_recuperer, isLoading: isLoading_action_recuperer, mutate: mutate_action_recuperer } = useSWR("/action_notif_recuperer", fetcher, { refreshInterval: 10000 });
  console.debug('data_action_recuperer:', data_action_recuperer);


  let length1 = 0;
  let length2 = 0;
  let length3 = 0;
    if (data && !error) {
    objects = data.filter(object => masked.indexOf(object[3]) < 0).map(object => ({ lid: object[1], cid: object[2], onom: object[3], date_appel: object[4] }));
    length1 = Object.keys(objects).length;
  }

  if (data_action_notif && !error_action_notif) {
    objects_notif = data_action_notif.map(object => ({ oid: object[0], action_id: object[1], demandeur: object[2], onom: object[3], debut: object[4] }));
    //console.debug('objects_notif:',objects_notif);
    length2 = Object.keys(objects_notif).length;
  }

  if (data_action_recuperer && !error_action_recuperer) {
    objects_notif_recuperer = data_action_recuperer.map(object => ({ oid: object[0], action_id: object[1], propriétaire: object[2], onom: object[3], debut: object[4] }));
    //console.debug('objects_notif:',objects_notif);
    length3 = Object.keys(objects_notif_recuperer).length;
  }

  useEffect(() => {
    setNumnotif(length1 + length2 + length3);
  }, [authToken, isLoading, isLoading_action_notif, isLoading_action_recuperer, length1, length2, length3]);

  console.debug('length1:', length1);
  console.debug('length2:', length2);
  console.debug('length3:', length3);


  console.log(`Bearer 1 ${authToken}`)
  console.log(error)
  const renderItem = ({ item }) => <NotifViewItem item={item} token={authToken} navigation={navigation} key={item.onom} />;
  const renderItemNotif = ({ item }) => <NotifViewItem2 item={item} token={authToken} key={item.oid} />;
  const renderItemNotifRecuperer = ({ item }) => <NotifViewItem3 item={item} token={authToken} key={item.oid} />;

  const DATA = [
    {
      title: "APPEL À MES EXPERTISES ",
      renderItem: renderItem,
      data: objects,
    },
    {
      title: "DEMANDES D'EMPRUNT",
      renderItem: renderItemNotif,
      data: objects_notif,
    },
    {
      title: "À RÉCUPÉRER",
      renderItem: renderItemNotifRecuperer,
      data: objects_notif_recuperer,
    },
  ];

  console.debug("error", error);
  console.debug("error_action_notif", error_action_notif);
  console.debug("error_action_recuperer", error_action_recuperer);


  return (
    <AlertNotificationRoot>
      <KivCard>

        {(error || error_action_notif || error_action_recuperer) && <View style={styles.incorrectWarning}>
          <Text
            style={styles.inputLabel}>
            Pas de Notifications
          </Text>
        </View>}
        {(isLoading || isLoading_action_notif || isLoading_action_recuperer) &&
          <ActivityIndicator size='large' animating={true} color='#FF0000' />}
        {(objects != null && objects_notif != null && objects_notif_recuperer != null) ?
          <SectionList
            ListHeaderComponent={
              <View
                style={styles.titleContainer}>
                <Text
                  style={styles.sous_titre}>
                  Toutes les notifications
                </Text>
              </View>}
            sections={DATA}
            scrollEnabled={true}
            keyExtractor={item => item.onom}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.title}>{title}</Text>
            )}
          />

          : null}
      </KivCard>
    </AlertNotificationRoot>
  );
}
