import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, SectionList } from 'react-native';
import KivCard from '../../common/KivCard.react';
import AllObjectsItem from './AllObjectsItem.react';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../../common/const';
import styles from '../Stylesheet';
import MainHeaderView from './MainHeaderView.react';


/**
 * Displays all the objects in Kivapp
 */

export default function Objects({ authToken, navigation }) {

  let objects;

  const fetcher = async (url) => {
    const res = await axios.get(baseUrl + url,
      { headers: { Authorization: `Bearer ${authToken}` } });
    return res.data;
  }

  const { data, error, isLoading } = useSWR("/objet", fetcher, { refreshInterval: 10000 });


  if (data && !error) {
    objects = data.map(object => ({ onom: object[1], oid: object[0], pictures: object[4], owner: object[3] }));
  }


  const DATA = [
    {
      title: "All Items",
      renderItem: renderItem,
      data: objects,
    },
  ];

  const renderItem = ({ item }) => <AllObjectsItem item={item} token={authToken} key={item.onom} />;

  return (
    <KivCard>
      {error && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {isLoading &&
        <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      {(objects != null) ? <SectionList
        ListHeaderComponent={< MainHeaderView navigation={navigation}></MainHeaderView>}
        sections={DATA}
        keyExtractor={item => item.oid}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
      />
        : null}

    </KivCard>
  );
}

