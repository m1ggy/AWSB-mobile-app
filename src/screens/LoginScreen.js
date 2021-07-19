import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
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

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setLoading] = useState(false);

  const alerts = (code) => {
    if (code === 'auth/invalid-email') {
      Alert.alert('Oops', 'This email is invalid! please use a valid email', [
        {
          text: 'OK',
        },
      ]);
    } else if (code === 'auth/user-not-found') {
      Alert.alert('Oops', 'Could not find user with this email!', [
        {
          text: 'OK',
        },
      ]);
    } else if (code === 'auth/wrong-password') {
      Alert.alert('Oops', 'Either the email or the password is incorrect!', [
        {
          text: 'OK',
        },
      ]);
    } else if ('noInput') {
      Alert.alert('No Input!', 'Email field and/or password field is empty!', [
        {
          text: 'OK',
        },
      ]);
    }
  };

  const loginUser = async () => {
    setLoading(true);

    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .catch((error) => {
        alerts(error.code);
      });
    setLoading(false);
  };

  if (isLoading === true) {
    return (
      <View style={styles.containerStyle}>
        <ActivityIndicator
          animating={isLoading}
          size='large'
          style={{ alignSelf: 'center' }}
          color='black'
        />
      </View>
    );
  }
  return (
    <View style={styles.containerStyle}>
      {/* <ImageBackground source={{uri:'https://gradienthunt.com/gradients-images/17999.jpg'}} style={styles.image}> */}
      <View
        style={{
          bottom: 50,
          width: 80,
          alignSelf: 'center',
          borderRadius: 15,
          paddingVertical: 5,
          borderWidth: 2.5,
        }}
      >
        <Ionicons
          name='ios-trash'
          size={50}
          color='black'
          style={{ alignSelf: 'center' }}
        />
        <Text style={styles.headerStyle}>AWSB</Text>
      </View>

      <TextInput
        style={styles.inputStyle}
        placeholder='Email'
        onChangeText={(value) => {
          setUser({ ...user, email: value });
        }}
      />
      <TextInput
        secureTextEntry={true}
        style={styles.inputStyle}
        placeholder='Password'
        onChangeText={(value) => {
          setUser({ ...user, password: value });
        }}
      />

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => {
          if (user.email.length != 0 && user.password.length != 0) {
            loginUser();
          } else {
            alerts('noInput');
          }
        }}
      >
        <Text style={{ alignSelf: 'center', color: colors.textLight }}>
          Login
        </Text>
      </TouchableOpacity>
      <Text style={styles.textStyle}>______________________</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={{ top: 100 }}
      >
        <Text
          style={{
            alignSelf: 'center',
            color: colors.textLight,
            backgroundColor: colors.buttonSecondary,
            paddingHorizontal: 65,
            paddingVertical: 10,
            borderRadius: 20,
          }}
        >
          Register
        </Text>
      </TouchableOpacity>

      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  headerStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'black',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  buttonStyle: {
    padding: 10,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 20,
    marginHorizontal: 90,
    marginTop: 30,
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  textStyle: {
    alignSelf: 'center',
    top: 50,
  },
  // image: {
  //     flex: 1,
  //     resizeMode: "cover",
  //     justifyContent: "center"
  //   },
});

export default LoginScreen;
