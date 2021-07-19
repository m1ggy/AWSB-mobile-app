import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import firebase from 'firebase';
import 'firebase/firestore';
import { colors } from '../constants';

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

const ref = firebase.firestore().collection('users');

//// initial state of the reducer
const initialState = {
  firstName: '',
  lastName: '',
  teacher: false,
  email: '',
  password: '',
  logs: [],
  points: [],
};

/// register screen function
const RegisterScreen = () => {
  const [credentials, setCredentials] = useState(initialState);
  const [isLoading, setLoading] = useState(false);

  //// alert msgs
  const alerts = (code) => {
    if (code === 'auth/email-already-in-use') {
      Alert.alert(
        'Oops',
        'This email is already in use! please use another email',
        [
          {
            text: 'OK',
          },
        ]
      );
    } else if (code === 'auth/invalid-email') {
      Alert.alert('Oops', 'This email is invalid! please use a valid email', [
        {
          text: 'OK',
        },
      ]);
    } else if (code === 'auth/invalid-password') {
      Alert.alert(
        'Oops',
        'This password is invalid! The password must be 6 characters long or more.',
        [
          {
            text: 'OK',
          },
        ]
      );
    } else if (code === 'noInput') {
      Alert.alert('Oops', 'Some fields are empty! Please fill in all fields', [
        {
          text: 'OK',
        },
      ]);
    }
  };

  const alertSuccess = () => {
    Alert.alert('Success!', 'Successfully registered', [
      {
        text: 'OK',
      },
    ]);
  };
  ///async function for firestore

  const sendUserInfo = async () => {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    setLoading(true);

    if (credentials.teacher === true) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(() => {
          ref.doc(credentials.email.toLowerCase()).set({
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            teacher: credentials.teacher,
            email: credentials.email.toLowerCase(),
            password: credentials.password,
            points: { total: 0, bio: 0, nonbio: 0 },
            logs: [{ date, time, type: 'account-creation' }],
            achievements: [
              'grey',
              'grey',
              'grey',
              'grey',
              'grey',
              'grey',
              'grey',
            ],
            classname: [],
          });
          alertSuccess();
        })
        .catch((error) => {
          alerts(error.code);
        });
    } else {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(() => {
          ref.doc(credentials.email.toLowerCase()).set({
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            teacher: credentials.teacher,
            email: credentials.email.toLowerCase(),
            password: credentials.password,
            points: { total: 0, bio: 0, nonbio: 0 },
            logs: [{ date, time, type: 'account-creation' }],
            achievements: [
              'grey',
              'grey',
              'grey',
              'grey',
              'grey',
              'grey',
              'grey',
            ],
          });
          alertSuccess();
        })
        .catch((error) => {
          alerts(error.code);
        });
    }

    setLoading(false);
  };

  if (isLoading === true) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating={isLoading} size='large' color='black' />
      </View>
    );
  }

  return (
    <View style={styles.viewStyle}>
      <ScrollView>
        <TextInput
          style={styles.textInputStyle}
          placeholder='First Name'
          onChangeText={(value) =>
            setCredentials({ ...credentials, firstName: value })
          }
        />
        <TextInput
          style={styles.textInputStyle}
          placeholder='Last Name'
          onChangeText={(value) =>
            setCredentials({ ...credentials, lastName: value })
          }
        />
        <TextInput
          style={styles.textInputStyle}
          placeholder='Email'
          onChangeText={(value) =>
            setCredentials({ ...credentials, email: value })
          }
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInputStyle}
          placeholder='Password'
          onChangeText={(value) =>
            setCredentials({ ...credentials, password: value })
          }
        />

        <CheckBox
          title='Teacher?'
          onPress={() => {
            setCredentials({ ...credentials, teacher: !credentials.teacher });
          }}
          checked={credentials.teacher}
          style={styles.checkBoxStyle}
          center={true}
          size={20}
          containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
        />

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            if (
              credentials.firstName.length != 0 ||
              credentials.lastName.length != 0 ||
              credentials.email.length != 0 ||
              credentials.password.length != 0
            ) {
              sendUserInfo();
            } else {
              alerts('noInput');
            }
          }}
        >
          <Text style={{ color: colors.textLight }}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    top: 50,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 20,
  },
  textInputStyle: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    padding: 10,
    width: 300,
    alignSelf: 'center',
  },
  buttonStyle: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 10,
    marginVertical: 50,
  },
  checkBoxStyle: {
    alignSelf: 'center',
  },
});

export default RegisterScreen;
