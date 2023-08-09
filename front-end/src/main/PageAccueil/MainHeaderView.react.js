import { Button, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { SearchBar } from "react-native-elements";
// Import Image Picker
import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../common/AppContext.react';
import styles from '../Stylesheet';
import KivCard from '../../common/KivCard.react';
import AllObjectsItem from './AllObjectsItem.react';
import { sendRequest } from '../../common/sendRequest';


/**
 *
 * @param navigation to navigate through the application
 * @returns header view
 */
export default function MainHeaderView({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermissionError, setPermissionError] = useState(false);
  const [search, setSearch] = useState(null);
  const { reload, authToken, logoutUser, content, setContent } = useContext(AppContext);


  let parsedData = {};

  const getSearchRequest = () => {
    setIsLoading(true);
    sendRequest(`/objet?filter=${content}`, 'GET', { token: authToken }, (status, data) => {
      console.log(authToken)
      setIsLoading(false);
      if (status == 200) {
        parsedData = data.map(object => ({ oid: object[1], onom: object[0], pictures: object[3], owner: object[2] }));
        console.log("data for search:", data);
        setSearch(parsedData);
        setPermissionError(false);
      } else if (status == 403) {
        setPermissionError(true);
      }
    }, () => { setIsLoading(false); });
  }


  useEffect(() => {
    getSearchRequest();
  }, [content, reload]);

  console.debug("parsedData for search:", parsedData);




  const renderItem = ({ item }) => <AllObjectsItem item={item} token={authToken} key={item.onom} />;

  return (

    <View style={styles.mainContainer}>
      <View
        style={styles.bottomButton}>
        <Button title="Log out" color="#ff937a" onPress={logoutUser} />
      </View>
      <View
        style={styles.cardContainer}>


      </View>
      <View>

        <SearchBar
          placeholder="Search Object here"
          value={content}
          onChangeText={(text) => { setContent(text) }}
          onClear={() => setContent('')} />

      </View>
      <View
        style={styles.cardContainer}>

      </View>
      <View>
        <Button
          title="Appel à un expert" color="#ff937a"
          onPress={() => navigation.navigate('AppelExpertView')}
        />
      </View>
      <KivCard>
        <View
          style={styles.titleContainer}>
          <Text
            style={styles.title}>
            Search results
          </Text>
        </View>

        {hasPermissionError && <View style={styles.incorrectWarning}>
          <Text
            style={styles.inputLabel}>
            Access Forbidden
          </Text>
        </View>}
        {isLoading &&
          <ActivityIndicator size='large' animating={true} color='#FF0000' />}
        {(search != null) ? <FlatList scrollEnabled={false}
          data={search}
          renderItem={renderItem}
          keyExtractor={item => item.onom}
        />

          : null}
      </KivCard>

    </View>


  );
}


