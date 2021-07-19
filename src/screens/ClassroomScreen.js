import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import StudentComponent from '../components/StudentComponent';
import TeacherScreen from '../screens/TeacherScreen';
import { colors } from '../constants';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const ClassroomScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(false);

  const ref = useRef('');
  let USER_INFO = '';
  const userRef = firebase.firestore().collection('users');
  const classRef = firebase.firestore().collection('class');
  /////PULL REFRESH
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      getUserInfo();
      setRefreshing(false);
    });
  }, []);

  const getUserInfo = async () => {
    setLoading(true);
    if (firebase.auth().currentUser != null) {
      let USER_INFO = firebase.auth().currentUser.email;
      await firebase
        .firestore()
        .collection('users')
        .doc(USER_INFO)
        .get()
        .then((docRef) => {
          setCredentials({ ...credentials, credentials: docRef.data() });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setLoading(false);
  };

  //// run this code at boot
  useEffect(() => {
    getUserInfo();
  }, []);

  const Banner = () => {
    return (
      <View
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 25,
          flex: 1,
        }}
      >
        <Text style={styles.textStyle}>Classroom</Text>
      </View>
    );
  };
  const checkType = () => {
    if (credentials.credentials.teacher) {
      return <TeacherScreen />;
    } else {
      return <StudentComponent />;
    }
  };

  return (
    <SafeAreaView style={styles.viewStyle}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Banner />
        {credentials ? checkType() : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flexGrow: 1,
    marginTop: Constants.statusBarHeight,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 22,
    top: 50,
  },
  addClassStyle: {
    top: 30,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  classesStyle: {
    top: 100,
    alignSelf: 'center',
    paddingHorizontal: 115,
    paddingTop: 10,
  },
  cancelButtonStyle: {
    padding: 10,
    backgroundColor: 'crimson',
    borderRadius: 20,
    marginHorizontal: 90,
    top: 70,
  },
  submitButtonStyle: {
    padding: 10,
    backgroundColor: '#ccf6c8',
    borderRadius: 20,
    marginHorizontal: 90,
  },
  inputStyle: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'black',
    fontFamily: 'FjallaOne_400Regular',
  },
});

export default ClassroomScreen;
