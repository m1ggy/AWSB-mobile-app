import React, { useEffect, userState, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import homeNavigator from './src/navigators/homeNavigator';
import authNavigator from './src/navigators/authNavigator';
import TutorialScreen from './src/screens/TutorialScreen';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';
import { FjallaOne_400Regular } from '@expo-google-fonts/fjalla-one';
import firebase from 'firebase';
import tutorialNavigator from './src/navigators/tutorialNavigator';

///firebase intialization
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyC7VbPdACHXfXdOf_Q-lFOmMmMdktakcwI',
    authDomain: 'awsb-849ca.firebaseapp.com',
    databaseURL: 'https://awsb-849ca.firebaseio.com',
    projectId: 'awsb-849ca',
    storageBucket: 'awsb-849ca.appspot.com',
    messagingSenderId: '626724598925',
    appId: '1:626724598925:web:0d182134165bbfa4a99ec4',
    measurementId: 'G-3X7KRR2XK6',
  });
}

const Stack = createStackNavigator();

export default function app() {
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    FjallaOne_400Regular,
  });
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name='Auth'
            component={authNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name='Home'
            component={tutorialNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
