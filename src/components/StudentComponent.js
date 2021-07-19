import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ScanComponent from '../components/ScanComponent';
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants';
const StudentComponent = () => {
  const [isLoading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState(false);
  const [teacherNames, setTeacherNames] = useState(false);
  const FieldValue = firebase.firestore.FieldValue;
  const [classList, setClassList] = useState(false);
  const classRef = firebase.firestore().collection('class');
  const userRef = firebase.firestore().collection('users');

  useEffect(() => {
    getUserInfo();
    getClassList();
  }, []);

  useEffect(() => {
    getTeacherName();
  }, [classList]);

  let USER_INFO = firebase.auth().currentUser.email;

  const getUserInfo = async () => {
    setLoading(true);
    if (firebase.auth().currentUser != null) {
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
  const getClassList = async () => {
    let classArray = [];
    const snapshot = await classRef.get();

    if (snapshot.empty) {
      console.log('class is empty');
    } else {
      snapshot.forEach((doc) => {
        classArray.push(doc.data());
      });

      setClassList(classArray);
    }
  };
  const getTeacherName = async () => {
    let teacherNameArray = [];
    let teachers = [];
    const snapshot = await userRef.where('teacher', '==', true).get();

    if (snapshot.empty) {
      console.log('EMPTY');
    } else {
      snapshot.forEach((doc) => {
        teacherNameArray.push(doc.data());
      });
      console.log(teacherNameArray);
    }
  };
  const joinClass = async (index) => {
    Alert.alert(
      'Confirm Action',
      `Do you really want to join ${classList[index].classname}?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            userRef.doc(credentials.credentials.email).set(
              {
                classname: classList[index].classname,
              },
              { merge: true }
            );

            Alert.alert('Success', 'Successfully joined the class!', [
              {
                text: 'OK',
                onPress: () => {
                  getUserInfo();
                },
              },
            ]);
          },
        },
        { text: 'Cancel' },
      ]
    );
  };
  const leaveClass = () => {
    Alert.alert('Confirm Action', 'Do you really want to leave this class?', [
      {
        text: 'Yes',
        onPress: () => {
          classRef.doc(credentials.credentials.classname).update({
            members: FieldValue.arrayRemove({
              email: credentials.credentials.email,
              firstName: credentials.credentials.firstName,
              lastName: credentials.credentials.lastName,
            }),
          });
          userRef.doc(credentials.credentials.email).update({
            classname: FieldValue.delete(),
          });
          Alert.alert('Success', 'You have left this class', [
            {
              text: 'OK',
              onPress: () => {
                getUserInfo();
              },
            },
          ]);
        },
      },
      { text: 'Cancel' },
    ]);
  };

  const ClassListComponent = () => {
    return classList.map((value, index) => {
      return (
        <View style={{ alignSelf: 'stretch' }} key={index}>
          <View style={{ alignSelf: 'center' }}>
            <View style={{ marginTop: 50, alignSelf: 'center' }}>
              <Text
                style={{ fontFamily: 'FjallaOne_400Regular', fontSize: 16 }}
              >
                {value.classname}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                joinClass(index);
              }}
              style={{
                borderRadius: 10,
                width: 150,
                alignSelf: 'center',
                height: 50,
                justifyContent: 'center',
                backgroundColor: colors.buttonPrimary,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 18,
                  fontFamily: 'FjallaOne_400Regular',
                  color: colors.textLight,
                }}
              >
                Join
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  function ActiveClass() {
    return (
      <View>
        {/* <TopBannerComponent/> */}

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 75,
            backgroundColor: colors.secondary,
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
            {credentials.credentials.classname}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            leaveClass();
          }}
          style={{
            alignSelf: 'center',
            backgroundColor: colors.buttonDanger,
            padding: 10,
            borderRadius: 10,
            marginTop: 50,
          }}
        >
          <Text
            style={{
              color: colors.textLight,
            }}
          >
            Leave Class
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Classless() {
    return <View>{classList ? <ClassListComponent /> : null}</View>;
  }

  if (credentials) {
    if (typeof credentials.credentials.classname != 'undefined') {
      return <ActiveClass />;
    } else {
      return <Classless />;
    }
  }
  return null;
};

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    alignSelf: 'center',
    top: 50,
  },
  inputStyle: {
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 5,
    margin: 10,
    paddingHorizontal: 100,
    top: 50,
  },
  searchResultStyle: {
    alignSelf: 'center',
    marginTop: 50,
  },
  addClassStyle: {
    paddingHorizontal: 50,
    alignItems: 'center',
  },
});

export default StudentComponent;
