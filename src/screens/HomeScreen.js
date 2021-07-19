import React, { useState, useEffect, useReducer, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Constants from 'expo-constants';
import firebase from 'firebase';
import 'firebase/firestore';
import LottieView from 'lottie-react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
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

const chartConfig = {
  backgroundGradientFrom: '#020024',
  backgroundGradientFromOpacity: 0.1,
  backgroundGradientTo: '#097579',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(9, 117, 121, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
let pieData = [];
let unsub;

const HomeScreen = () => {
  // const [state, dispatch] = useReducer(reducer, {type:''});
  const [credentials, setCredentials] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [listener, setListener] = useState(false);
  const [trivia, setTrivia] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const ref = useRef();
  const answerRef = useRef();
  const classRef = firebase.firestore().collection('class');
  const quizRef = useRef(null);
  quizRef.current = false;
  let USER_INFO = '';

  const db = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.email);
  const getUserInfo = async () => {
    setLoading(true);
    if (firebase.auth().currentUser != null) {
      USER_INFO = firebase.auth().currentUser.email;
      await firebase
        .firestore()
        .collection('users')
        .doc(USER_INFO)
        .get()
        .then((docRef) => {
          setCredentials({ ...credentials, credentials: docRef.data() });
          pieData = [];
          pieData.push({
            name: 'bio',
            points: docRef.data().points.bio,
            color: '#00af91',
            legendFontColor: 'black',
            legendFontSize: 15,
          });
          pieData.push({
            name: 'non-bio',
            points: docRef.data().points.nonbio,
            color: 'skyblue',
            legendFontColor: 'black',
            legendFontSize: 15,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setLoading(false);
  };

  function listenerHelper(params) {
    setListener(params);
  }
  function quizHelper(params) {
    setQuizActive(params);
  }
  function answerHelper(params, type) {
    setAnswer(params);
    if (params === true && type === 'bio') {
      db.set(
        {
          points: {
            total: firebase.firestore.FieldValue.increment(1),
            bio: firebase.firestore.FieldValue.increment(1),
          },
        },
        { merge: true }
      );
    } else if (params === false && type === 'bio') {
      return;
    } else if (params === true && type === 'non-bio') {
      db.set(
        {
          points: {
            total: firebase.firestore.FieldValue.increment(1),
            nonbio: firebase.firestore.FieldValue.increment(1),
          },
        },
        { merge: true }
      );
    } else if (params === false && type === 'non-bio') {
      return;
    }
  }

  function evaluator() {
    return ref.current.type === 'paper' && answerRef.current === 'bio'
      ? answerHelper(true, 'bio') //paper condition
      : ref.current.type === 'paper' && answerRef.current === 'non-bio'
      ? answerHelper(false, 'bio')
      : ref.current.type === 'plastic bottle' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio') //plastic bottle
      : ref.current.type === 'plastic bottle' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio')
      : ref.current.type === 'paper cup' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio') //paper cup
      : ref.current.type === 'paper cup' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio')
      : ref.current.type === 'ballpen' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio') //ballpen
      : ref.current.type === 'ballpen' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio')
      : ref.current.type === 'plastic cup' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio') ///plastic cup
      : ref.current.type === 'plastic cup' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio')
      : ref.current.type === 'paper bowl' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio') ///paper bowl
      : ref.current.type === 'paper bowl' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio')
      : ref.current.type === 'plastic wrapper' &&
        answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio') ////plastic wrapper
      : ref.current.type === 'plastic wrapper' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio')
      : ref.current.type === 'plastic spoon' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio') ////plastic spoon
      : ref.current.type === 'plastic spoon' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio')
      : ref.current.type === 'plastic fork' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio') ////plastic fork
      : ref.current.type === 'plastic fork' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio')
      : ref.current.type === 'newspaper' && answerRef.current === 'bio'
      ? answerHelper(true, 'bio') ////newspaper
      : ref.current.type === 'newspaper' && answerRef.current === 'non-bio'
      ? answerHelper(false, 'bio')
      : ref.current.type === 'tetra pack' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio') /////tetra pack
      : ref.current.type === 'tetra pack' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio')
      : ref.current.type === 'yakult bottle' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio') ////yakult bottle
      : ref.current.type === 'yakult bottle' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio')
      : ref.current.type === 'apple' && answerRef.current === 'bio'
      ? answerHelper(true, 'bio') //// apple
      : ref.current.type === 'apple' && answerRef.current === 'non-bio'
      ? answerHelper(false, 'bio')
      : ref.current.type === 'face mask' && answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio') ////facemask
      : ref.current.type === 'face mask' && answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio')
      : ref.current.type === 'fruit foam net wrapper' &&
        answerRef.current === 'bio'
      ? answerHelper(false, 'non-bio') ////fruit foam net wrapper
      : ref.current.type === 'fruit foam net wrapper' &&
        answerRef.current === 'non-bio'
      ? answerHelper(true, 'non-bio')
      : null;
  }

  function Trivias() {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={trivia}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={{ ...styles.modalView, height: 500, width: 300 }}>
            {answer ? (
              <View style={{ width: 300, paddingVertical: 50 }}>
                <LottieView
                  source={require('../animations/9553-check-animation.json')}
                  autoPlay={true}
                  loop={false}
                />
              </View>
            ) : (
              <View style={{ width: 300, paddingVertical: 50 }}>
                <LottieView
                  source={require('../animations/39166-cross.json')}
                  autoPlay={true}
                  loop={false}
                />
              </View>
            )}
            <View>
              {ref.current.type === 'paper' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Paper is usually made from plant based sources and as such
                    will biodegrade and is compostable.{' '}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'paper' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Paper is usually made from plant based sources and as such
                    will biodegrade and is compostable.{' '}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'plastic bottle' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Plastic Bottles is made from petroleum, a product of oil,
                    using heat and a catalyst to change the propylene into
                    polypropylene, a substance not found in nature. PET is a
                    polyester. Since these are unnatural products, not found in
                    nature, there are no organisms capable of decomposing the
                    material, {'\n'}so it will not degrade as does other plant
                    and animal waste.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}> +1 Point</Text>
                </View>
              ) : ref.current.type === 'plastic bottle' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Plastic Bottles is made from petroleum, a product of oil,
                    using heat and a catalyst to change the propylene into
                    polypropylene, a substance not found in nature. PET is a
                    polyester. Since these are unnatural products, not found in
                    nature, there are no organisms capable of decomposing the
                    material, {'\n'}so it will not degrade as does other plant
                    and animal waste.{'\n'}{' '}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'paper cup' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Paper-based cups are usually lined with a membrane of
                    polyethylene (plastic) to make them waterproof, but it means
                    they are not recyclable alongside paper or cardboard, or
                    biodegradable.{' '}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'paper cup' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Paper-based cups are usually lined with a membrane of
                    polyethylene (plastic) to make them waterproof, but it means
                    they are not recyclable alongside paper or cardboard, or
                    biodegradable.{' '}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'ballpen' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    All the disposable pens and refills, whose metal points
                    contain toxic materials like lead, end up in landfills,
                    waterways and in other places with the toxic contents
                    ultimately trickling down to the soil and the groundwater
                    table. Ball point pens also is made out of plastic which is
                    non-biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'ballpen' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    All the disposable pens and refills, whose metal points
                    contain toxic materials like lead, end up in landfills,
                    waterways and in other places with the toxic contents
                    ultimately trickling down to the soil and the groundwater
                    table. Ball point pens also is made out of plastic which is
                    non-biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'plastic cup' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    A plastic cup is a cup made out of plastic. It is most
                    commonly used as a container to hold beverages. Some are
                    reusable while others are intended for a single use followed
                    by recycling or disposal.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'plastic cup' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    A plastic cup is a cup made out of plastic. It is most
                    commonly used as a container to hold beverages. Some are
                    reusable while others are intended for a single use followed
                    by recycling or disposal.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'paper bowl' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Paper-based bowls/cups are usually lined with a membrane of
                    polyethylene (plastic) to make them waterproof, but it means
                    they are not recyclable alongside paper or cardboard, or
                    biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'paper bowl' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Paper-based bowls/cups are usually lined with a membrane of
                    polyethylene (plastic) to make them waterproof, but it means
                    they are not recyclable alongside paper or cardboard, or
                    biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'plastic wrapper' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Plastic wrappers are non biodegradable. it is usually made
                    for storing items and protecting the contents from getting
                    soiled. plastics wrappers or plastic packaging is usually
                    extremely wasteful and the majority of it are sent to
                    landfills or disposed of into the environment.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'plastic wrapper' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Plastic wrappers are non biodegradable. it is usually made
                    for storing items and protecting the contents from getting
                    soiled. plastics wrappers or plastic packaging is usually
                    extremely wasteful and the majority of it are sent to
                    landfills or disposed of into the environment.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'plastic spoon' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Just like any other plastics, plastic forks/ spoon are non
                    biodegradable as they take as much as 1000 years before
                    decomposing.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'plastic spoon' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Just like any other plastics, plastic forks/ spoon are non
                    biodegradable as they take as much as 1000 years before
                    decomposing.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'plastic fork' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Just like any other plastics, plastic forks/ spoon are non
                    biodegradable as they take as much as 1000 years before
                    decomposing.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'plastic fork' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Just like any other plastics, plastic forks/ spoon are non
                    biodegradable as they take as much as 1000 years before
                    decomposing.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'newspaper' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Newspaper is usually made from plant based sources and as
                    such will biodegrade and is compostable.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'newspaper' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Newspaper is usually made from plant based sources and as
                    such will biodegrade and is compostable.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'tetra pack' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Tetra Paks are made from 75% Paper, however, it has a lining
                    of polyethylene and aluminium which makes it
                    non-biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'tetra pack' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Tetra Paks are made from 75% Paper, however, it has a lining
                    of polyethylene and aluminium which makes it
                    non-biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'yakult bottle' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Yakult bottles are made out of a plastic called polystyrene
                    resin which makes it non-biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'yakult bottle' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Yakult bottles are made out of a plastic called polystyrene
                    resin which makes it non-biodegradable.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'apple' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Apples can decompose easily. It is a biodegradable waste.
                    {'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'apple' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Apples can decompose easily. It is a biodegradable waste.
                    {'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'face mask' && answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Face mask are non-biodegradable. They should be disposed
                    after use as they can spread diseases.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'face mask' && answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Face mask are non-biodegradable. They should be disposed
                    after use as they can spread diseases.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : ref.current.type === 'fruit foam net wrapper' &&
                answer === true ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Fruit foam net wrappers are made out of styrofoam. Styrofoam
                    cannot degrade or break down even after a long period of
                    time. styrofoam is a non biodegradable waste.{'\n'}
                  </Text>
                  <Text style={styles.correctAnswerStyle}>+1 Point</Text>
                </View>
              ) : ref.current.type === 'fruit foam net wrapper' &&
                answer === false ? (
                <View>
                  <Text
                    style={
                      (styles.triviaStyle,
                      { textAlign: 'justify', alignSelf: 'center' })
                    }
                  >
                    Fruit foam net wrappers are made out of styrofoam. Styrofoam
                    cannot degrade or break down even after a long period of
                    time. styrofoam is a non biodegradable waste.{'\n'}
                  </Text>
                  <Text style={styles.wrongAnswerStyle}>No Point :(</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={{
                ...styles.openButton,
                backgroundColor: '#70af85',
                marginTop: 50,
                width: 100,
                marginHorizontal: 150,
              }}
              onPress={() => {
                getUserInfo();
                setTrivia(!trivia);
              }}
            >
              <Text style={{ alignSelf: 'center' }}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  ////listening for changes in the database
  function eventListener() {
    return (unsub = db.onSnapshot(
      (docSnapshot) => {
        console.log('listening');
        if (
          docSnapshot.data().logs.length > credentials.credentials.logs.length
        ) {
          console.log('LOGS CHANGED');
          console.log(
            docSnapshot.data().logs[docSnapshot.data().logs.length - 1]
          );
          ref.current =
            docSnapshot.data().logs[docSnapshot.data().logs.length - 1];
          console.log(
            credentials.credentials.logs[
              credentials.credentials.logs.length - 1
            ].time
          );
          setQuizActive(false);
          quizRef.current = false;
          listenerHelper(true);
        } else {
          console.log('NO CHANGES');
        }
      },
      (e) => {
        console.log(e);
      }
    ));
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  ////main quiz Component
  const Quiz = () => {
    return (
      <View style={{ alignSelf: 'center' }}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={quizActive}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <LottieView
            source={require('../animations/3009-sparkles.json')}
            autoPlay
          />
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <QRCode value={credentials.credentials.email} size={200} />

              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: 'gray',
                  marginTop: 30,
                }}
                onPress={() => {
                  unsub();
                  setQuizActive(!quizActive);
                  getUserInfo();
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const ModalQuiz = () => {
    return (
      <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={listener}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ alignSelf: 'center' }}>
                Guess what type of trash you segregated!
              </Text>
              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: '#bedbbb',
                  marginTop: 30,
                }}
                onPress={() => {
                  answerRef.current = 'bio';
                  evaluator();
                  setTrivia(true);
                  unsub();
                  setListener(!listener);
                }}
              >
                <Text>Biodegradable</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: '#a6dcef',
                  marginTop: 30,
                }}
                onPress={() => {
                  answerRef.current = 'non-bio';
                  evaluator();
                  setTrivia(true);
                  unsub();
                  setListener(!listener);
                }}
              >
                <Text>Non-Biodegradable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const Home = () => {
    return (
      <View>
        <View
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 25,
            flex: 1,
          }}
        >
          <Text style={styles.textStyle}>Home</Text>
        </View>
        {credentials && trivia ? <Trivias /> : null}
        {listener ? <ModalQuiz /> : null}

        <View
          style={{
            alignContent: 'center',
            alignSelf: 'center',
            flex: 1,
            marginTop: 50,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              marginBottom: 25,
              alignSelf: 'center',
              fontFamily: 'Lato_400Regular',
            }}
          >
            Welcome {credentials.credentials.firstName}!
          </Text>
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 10,
            width: 150,
            alignSelf: 'center',
            height: 50,
            justifyContent: 'center',
            backgroundColor: colors.buttonPrimary,
          }}
          onPress={() => {
            getUserInfo();
            eventListener();
            quizRef.current = true;
            quizHelper(true);
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 24,
              fontFamily: 'FjallaOne_400Regular',
              color: colors.textDark,
            }}
          >
            Scan
          </Text>
        </TouchableOpacity>
        <View style={{ alignSelf: 'center', top: 30 }}>
          <Text>Current Score:</Text>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'FjallaOne_400Regular',
              alignSelf: 'center',
              color: colors.primary,
            }}
          >
            {' '}
            {credentials.credentials.points.total}
          </Text>
        </View>

        <Quiz />
        <View
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 25,
            flex: 1,
            marginTop: 50,
          }}
        >
          <Text style={styles.textStyle}>Stats</Text>
        </View>
        <View style={{ paddingBottom: 50 }}>
          <PieChart
            data={pieData}
            width={Dimensions.get('window').width}
            height={200}
            chartConfig={chartConfig}
            accessor={'points'}
          />
          <View style={{ alignContent: 'stretch' }}>
            <Text style={{ alignSelf: 'center' }}>
              Bio: {credentials.credentials.points.bio} Non-bio:{' '}
              {credentials.credentials.points.nonbio}
            </Text>
          </View>
        </View>
        <View>
          {/* <ContributionGraph


                        /> */}
        </View>
      </View>
    );
  };
  const Loading = () => {
    return (
      <View style={{ justifyContent: 'center', marginTop: 300 }}>
        <ActivityIndicator
          animating={isLoading}
          size='large'
          color='black'
          style={{ alignSelf: 'center' }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.viewStyle}>
      <ScrollView>
        {credentials ? <Home /> : <Loading />}
        {/* {credentials?activeListener():null} */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'black',
    fontFamily: 'FjallaOne_400Regular',
  },
  statsStyle: {
    backgroundColor: '#213e3b',
    borderRadius: 30,
    height: 250,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    top: 30,
  },
  statTextStyle: {
    fontSize: 18,
    color: 'white',
  },
  titleStyle: {
    alignSelf: 'center',
    fontSize: 20,
    color: 'black',
    marginTop: 50,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  correctAnswerStyle: {
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'FjallaOne_400Regular',
    color: 'green',
  },
  wrongAnswerStyle: {
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'FjallaOne_400Regular',
    color: 'crimson',
  },
  triviaStyle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
  },
});

export default HomeScreen;
