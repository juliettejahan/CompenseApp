import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#7ba39f',
        padding: 8,
        fontSize:20,
        fontWeight:"bold",
    }
});

export default function Header({ username }) {
    const text = username == null ? <Text>Logged out</Text>
        : <Text>Logged in as {username}</Text>;
    return (<View style={styles.header}>{text}</View>);
}
