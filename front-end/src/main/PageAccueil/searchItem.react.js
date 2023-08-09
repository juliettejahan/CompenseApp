import React from 'react';
import { View, Text, Image } from 'react-native';
import KivCard from '../common/KivCard.react';
import styles from './Stylesheet';

/**
 * Single item of research result
 * @typedef {{oid: integer, onom: string, picture, owner : string}} Object
 * @param {Object} item
 */

export default function SearchItem({ item }) {
        return (
                <KivCard>
                        <View style={[{ flexDirection: 'row' }]}>
                                <View style={{ flex: 1 }}>
                                        <Image style={styles.item_content} source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
                                </View>

                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={[styles.item_content, { flex: 1 }]}>
                                                {item.onom}
                                        </Text>

                                </View>

                        </View>
                </KivCard>);
}

