import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase';
import Constants from 'expo-constants';

import { colors } from '../constants';
const signOut = () => {
  Alert.alert('Signed Out', 'You have been signed out!', [{ text: 'Ok' }]);
};
const TopBannerComponent = () => {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingVertical: 25,
      }}
    >
      <Text
        style={{
          fontFamily: 'FjallaOne_400Regular',
          fontSize: 30,
          color: 'black',
          alignSelf: 'center',
        }}
      >
        Settings
      </Text>
    </View>
  );
};

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.viewStyle}>
      <TopBannerComponent />
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => {
          firebase
            .auth()
            .signOut()
            .then(() => signOut());
        }}
      >
        <Text style={{ color: 'white' }}>Sign Out</Text>
      </TouchableOpacity>
      <View style={{ alignSelf: 'center', marginTop: 25 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Tutorial');
          }}
          style={{
            ...styles.buttonStyle,
            backgroundColor: '#5aa469',
            marginTop: 25,
          }}
        >
          <Text style={{ alignSelf: 'center', color: 'white' }}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  textStyle: {
    alignSelf: 'center',
    bottom: 250,
  },
  buttonStyle: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: '#d8345f',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 50,
  },
});

export default SettingsScreen;
