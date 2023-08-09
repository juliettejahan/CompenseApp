import React, { useState } from 'react';
import { View, Text, ActivityIndicator, SectionList } from 'react-native';
import CaracteristiquesItem from './CaracteristiquesItem.react';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../../common/const';
import styles from '../Stylesheet';
import InfoPersonnelView from './InfoPersonnelView.react';
import KivCard from '../../common/KivCard.react';

/**
 * Displays the group or categories (expertises) of the logged in user
 */

export default function Caracteristiques({ route, navigation, authToken }) {
  let caracteristiques;
  let caracteristiques2;

  const fetcher = async (url) => {
    const res = await axios.get(baseUrl + url,
      { headers: { Authorization: `Bearer ${authToken}` } });
    return res.data;
  }


  const { data, error, isLoading, mutate } = useSWR(`/${'appartient'}`, fetcher, { refreshInterval: 10000 });
  const { data: data2, error: error2, isLoading: isLoading2 } = useSWR(`/${'EstExpert'}`, fetcher, { refreshInterval: 10000 });


  if (data && !error) {
    caracteristiques = data.map(object => ({ cnom: object[0] }));
  }
  if (data2 && !error2) {
    caracteristiques2 = data2.map(object => ({ cnom: object[1] }));
  }

  console.log(error)

  const renderItem = ({ item }) => <CaracteristiquesItem item={item} token={authToken} key={item.cnom} />;


  const DATA = [
    {
      title: "Mes groupes",
      data: caracteristiques,
    },
    {
      title: "Mes expertises",
      data: caracteristiques2,
    },

  ];

  console.debug('caracteristiques:', caracteristiques);
  console.debug('caracteristiques2:', caracteristiques2);
  console.debug('data:', data);
  console.debug('data2:', data2);


  return (
    <KivCard style={{ flex: 1 }}>

      {error && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {isLoading &&
        <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      {(caracteristiques != null && caracteristiques2 != null) ?
        <SectionList
          ListHeaderComponent={
            <View style={[{ flex: 1 }, { flexDirection: 'column' }]}>
              <InfoPersonnelView route={route} authToken={authToken} navigation={navigation} />
            </View>}
          sections={DATA}
          scrollEnabled={true}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sous_titre}>{title}</Text>
          )}
        />
        : null}
    </KivCard>
  );
}






