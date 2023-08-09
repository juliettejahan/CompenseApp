import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, Button, Image } from 'react-native';
import { InfoPersonnelViewItem } from './InfoPersonnelViewItem.react';
import AppContext from '../../common/AppContext.react';
import { baseUrl } from '../../common/const';
import KivCard from '../../common/KivCard.react';
import styles from '../Stylesheet';
import axios from 'axios';
import useSWR from 'swr';

/**
 * Displays the group or categories (expertises) of the logged in user
 * @params navigation
 */

export default function InfoPersonnelView({ navigation }) {
  const { authToken } = useContext(AppContext);

  let item;

  const fetcher = async (url) => {
    const res = await axios.get(baseUrl + url,
      { headers: { Authorization: `Bearer ${authToken}` } });
    return res.data;
  }

  const { data, error, isLoading } = useSWR("/get_auth_infopersonnel", fetcher, { refreshInterval: 10000 });

  console.debug("data", data);
  console.debug("datatype", typeof (data));

  if (data && !error) {
    item = ({
      lid: data[0],
      login: data[1], email: data[2],
      mobile: data[3], password: data[4],
      created: data[5], isAdmin: data[6],
      unom: data[7], prenom: data[8],
      pictures: baseUrl + data[9].substring(1),
    });
  }



  const renderItem = ({ item }) => <InfoPersonnelViewItem item={item} token={authToken} key={item.lid} />;

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
      {item != null ? <KivCard>

        <View style={[{ flexDirection: 'row' }]}>

          <View style={{ flex: 3, flexDirection: 'column' }}>
            <Text style={[styles.perso_data, { flex: 1 }]}>
              Login : {item.login}
            </Text>
            <Text style={[styles.perso_data, { flex: 1 }]}>
              Nom : {item.unom}
            </Text>
            <Text style={[styles.perso_data, { flex: 1 }]}>
              Prénom : {item.prenom}
            </Text>

          </View>

          <View style={{ flex: 1 }}>
            <Image style={styles.logo} source={{ uri: item.pictures }} />
          </View>

        </View>
      </KivCard>
        : null}

      <Button title="Change profile" color="#ff937a" disabled={isLoading} onPress={() => navigation.navigate('ChangeProfileView')} />
    </View>
  );
}
