import React from 'react';
import { View, Text } from 'react-native';
import KivCard from '../../common/KivCard.react';
import styles from '../Stylesheet';

/**
 * @typedef {{dispo: bool, onom: string}} Object
 * @param {Object} item
 */

export default function CaracteristiquesItem({ item }, token) {
  console.debug('item.onom', item.cnom);
  return (
    <KivCard>
      <View style={[{ flexDirection: 'row' }]}>

        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={[styles.expertise, { flex: 1 }]}>
            {item.cnom}
          </Text>

        </View>

      </View>
    </KivCard>);
}

