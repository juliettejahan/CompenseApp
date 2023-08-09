import React from 'react';
import { View, Text, ActivityIndicator, SectionList } from 'react-native';
import styles from '../Stylesheet';
import CatalogueItem from '../PageMesObjets/catalogueItem.react';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../../common/const';

/**
 * Displays all the actions the current user is engaged in
 */

export default function MesActions({ authToken }) {

  let action;
  let action2;
  let action3;


  const fetcher = async (url) => {
    const res = await axios.get(baseUrl + url,
      { headers: { Authorization: `Bearer ${authToken}` } });
    return res.data;
  }

  const { data, error, isLoading, mutate } = useSWR(`/action?action_id=${1}`, fetcher, { refreshInterval: 10000 });
  const { data: data2, error: error2, isLoading: isLoading2 } = useSWR(`/action?action_id=${2}`, fetcher, { refreshInterval: 10000 });
  const { data: data3, error: error3, isLoading: isLoading3 } = useSWR(`/action?action_id=${3}`, fetcher, { refreshInterval: 10000 });


  if (data && !error) {
    action = data.map(object => ({ onom: object[3], pictures: object[5], preteur: object[6] }));
  }
  if (data2 && !error2) {
    action2 = data2.map(object => ({ onom: object[3], pictures: object[5], preteur: object[6] }));
  }
  if (data3 && !error3) {
    action3 = data3.map(object => ({ onom: object[3], pictures: object[5], preteur: object[6] }));
  }

  console.debug("action", action);
  console.debug("action2", action2);
  console.debug("action3", action3);

  const renderItem = ({ item }) => <CatalogueItem item={item} filtre_dispo={0} token={authToken} key={item.onom} />;


  const DATA = [
    {
      title: "Mes demandes",
      data: action,
    },
    {
      title: "Objets en attente de récupération par moi",
      data: action2,
    },
    {
      title: "Mes emprunts en cours",
      data: action3,
    },

  ];

  return (
    <View style={{ flex: 1 }}>

      {error && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {isLoading &&
        <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      {(action != null && action2 != null && action3 != null) ?

        <SectionList
          sections={DATA}
          keyExtractor={item => item.onom}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sous_titre}>{title}</Text>
          )}
        />

        : null}
    </View>
  );
}



