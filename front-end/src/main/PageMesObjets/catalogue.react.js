import { View, Text, ActivityIndicator, SectionList } from 'react-native';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../../common/const';
import CatalogueItem from './catalogueItem.react';
import styles from '../Stylesheet';

/**
 * Displays all the objects in Kivapp of the logged in user with their status
 */

export default function Catalogue({ authToken }) {

  let catalogue;
  let catalogue2;
  let catalogue3;
  let catalogue4;


  const fetcher = async (url) => {
    const res = await axios.get(baseUrl + url,
      { headers: { Authorization: `Bearer ${authToken}` } });
    return res.data;
  }
  const { data, error, isLoading, mutate } = useSWR(`/objet?filter_by_mine=True&filtre_dispo=${0}`, fetcher, { refreshInterval: 10000 });
  const { data: data2, error: error2, isLoading: isLoading2 } = useSWR(`/objet?filter_by_mine=True&filtre_dispo=${1}`, fetcher, { refreshInterval: 10000 });
  const { data: data3, error: error3, isLoading: isLoading3 } = useSWR(`/objet?filter_by_mine=True&filtre_dispo=${2}`, fetcher, { refreshInterval: 10000 });
  const { data: data4, error: error4, isLoading: isLoading4 } = useSWR(`/objet?filter_by_mine=True&filtre_dispo=${3}`, fetcher, { refreshInterval: 10000 });

  if (data && !error) {
    catalogue = data.map(object => ({ onom: object[0], pictures: object[3], oid: object[5] }));
  }
  if (data2 && !error2) {
    catalogue2 = data2.map(object => ({ onom: object[0], pictures: object[3], oid: object[6], preteur: object[5] }));
  }
  if (data3 && !error3) {
    catalogue3 = data3.map(object => ({ onom: object[0], pictures: object[3], oid: object[6], preteur: object[5] }));
  }
  if (data4 && !error4) {
    catalogue4 = data4.map(object => ({ onom: object[0], pictures: object[3], oid: object[6], preteur: object[5] }));
  }



  const renderItem = ({ item }) => <CatalogueItem item={item} filtre_dispo={0} token={authToken} key={(item.onom, item.oid)} />;
  const renderItem_rendu = ({ item }) => <CatalogueItem item={item} filtre_dispo={3} token={authToken} key={(item.onom, item.oid)} />;

  const DATA = [
    {
      title: "Mes objets disponibles au prêt",
      renderItem: renderItem,
      data: catalogue,
    },
    {
      title: "Mes objets demandés",
      renderItem: renderItem,
      data: catalogue2,
    },
    {
      title: "Mes objets en attente de récupération",
      renderItem: renderItem,
      data: catalogue3,
    },
    {
      title: "Mes prêts en cours",
      renderItem: renderItem_rendu,
      data: catalogue4,
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
      {(isLoading) &&
        <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      {(catalogue != null && catalogue2 != null && catalogue3 != null && catalogue4 != null) ?
        <SectionList style={{ flex: 1 }}
          sections={DATA}
          scrollEnabled={true}
          keyExtractor={item => (item.oid, item.onom)}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sous_titre}>{title}</Text>
          )}
        />

        : null}
    </View>
  );
}



