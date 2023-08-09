import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

//Screen
import MainView from './PageAccueil/MainView.react';
import AppContext from '../common/AppContext.react';
import NotifView from './PageNotifications/NotifView.react';
import ProfileView from './PageProfile/ProfileView.react';
import AddNewObject from './PageAddObject/AddNewObject.react';
import MesObjetsView from './PageMesObjets/MesObjetsView.react';
import MesDemandesView from './PageMesActions/MesDemandesView.react';

const Tab = createBottomTabNavigator();

function Ok() {
    return (<Text>CAMarche</Text>)
}

export default function Bar() {
    const { numNotif } = useContext(AppContext);
    return (
        <View style={{ height: '100%' }}>


            <Tab.Navigator
                initialRouteName='Accueil'
                screenOptions={{
                    headerShown: true,
                    tabBarShowLabel: true,
                    tabBarStyle: { backgroundColor: '#ff937a' },
                    tabBarInactiveTintColor: '#fff',
                    tabBarActiveTintColor: 'yellow',
                    tabBarLabelPosition: 'below-icon',
                    tabBarLabelStyle: { fontSize: 10 },
                }}>

                <Tab.Screen
                    name="Accueil"
                    component={MainView}
                    options={{
                        tabBarLabel: 'accueil',
                        title: 'Accueil',
                        tabBarBadgeStyle: { backgroundColor: 'yellow' },
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" color={color} size={size} />
                        ),

                    }}
                />

                <Tab.Screen
                    name="Profil"
                    component={ProfileView}
                    options={({ route }) => ({
                        tabBarLabel: 'profil',
                        title: 'Profil',


                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="man" color={color} size={size} />
                        ),


                    })}
                />

                <Tab.Screen
                    name="Mes objets"
                    component={MesObjetsView}
                    options={{
                        tabBarLabel: 'mes objets',
                        title: 'Mes objets',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="paper-plane" color={color} size={size} />
                        ),

                    }}
                />

                <Tab.Screen
                    name="Mes demandes"
                    component={MesDemandesView}
                    options={{
                        tabBarLabel: 'mes actions',
                        title: 'Mes actions',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="cart" color={color} size={size} />
                        ),

                    }}
                />


                <Tab.Screen
                    name="Ajout d un Object"
                    component={AddNewObject}
                    options={{
                        tabBarLabel: 'ajout d un Object',
                        title: "Ajout d'un objet",
                        tabBarIcon: ({ color, size }) => (
                            <View>
                                <Ionicons name="add-circle" color={color} size={size} />
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Notifications"
                    component={NotifView}
                    options={{
                        tabBarLabel: 'notifications',
                        title: 'Notifications',
                        tabBarBadge: numNotif,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="notifications" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

const getTabBarVisibility = route => {
    // console.log(route);
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
    // console.log(routeName);

    if (routeName == 'GameDetails') {
        return 'none';
    }
    return 'flex';
};
