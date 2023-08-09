import React from 'react';
import { View, Text } from 'react-native';
import KivCard from '../../common/KivCard.react';
import styles from '../Stylesheet';

/**
 * @typedef {{dispo: bool, onom: string, picture, owner: string}} Object
 * @param {Object} item
 */

export default function InfoPersonnelViewItem({ item }) {
        console.debug('item.login', item.login);

        return (
                <KivCard>
                        <View style={[{ flexDirection: 'row' }]}>

                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.lid}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.login}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.email}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.mobile}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.password}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.created}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.isAdmin}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.unom}
                                        </Text>
                                        <Text style={[styles.expertise, { flex: 1 }]}>
                                                {item.prenom}
                                        </Text>

                                </View>

                        </View>
                </KivCard>);
}

