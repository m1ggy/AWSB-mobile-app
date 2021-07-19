import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';
import Constants from 'expo-constants';
import { Image } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import { colors } from '../constants';

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const LeaderboardScreen = () => {
  /////PULL REFRESH
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      getUserInfo();
      setRefreshing(false);
    });
  }, []);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersActive, setUsersActive] = useState(false);
  const [leaderboardPopulated, setLeaderboardPopulated] = useState(false);
  let array = [];
  const getUserInfo = async () => {
    setLoading(true);
    if (firebase.auth().currentUser != null) {
      const snapshot = await firebase
        .firestore()
        .collection('users')
        .where('teacher', '==', false)
        .orderBy('points.total', 'desc')
        .get();
      if (snapshot.empty) {
        setLeaderboardPopulated(false);
      } else {
        setLeaderboardPopulated(true);
        if (array.length > 0) {
          array = [];
        }
        snapshot.forEach((doc) => {
          array.push(doc.data());
        });

        setUsers(array);
        setUsersActive(true);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const Leaderboard = () => {
    let arrayOfKeys = [];
    users.forEach((user) => {
      arrayOfKeys.push(Object.keys(user.points));
    });
    if (leaderboardPopulated) {
      return users.map((value, index) => {
        if (index === 0) {
          firebase.firestore().collection('users').doc(value.email).set(
            {
              leader: true,
            },
            { merge: true }
          );
        }
        if (value.email.toLowerCase() === firebase.auth().currentUser.email) {
          return (
            <View key={index} style={styles.listContainer}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ margin: 10 }}>
                  {index === 0 ? (
                    <View style={{ bottom: 65, right: 30 }}>
                      <LottieView
                        source={require('../animations/40243-fire-loop.json')}
                        autoPlay={true}
                        height={100}
                        width={100}
                        loop={true}
                      />
                    </View>
                  ) : null}
                  <Text style={styles.numberStyle}>#{index + 1} YOU</Text>
                </View>
              </View>
              <View style={{ margin: 10 }}>
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    fontFamily: 'Lato_400Regular',
                    marginBottom: 5,
                  }}
                >
                  {value.firstName} {value.lastName}
                </Text>
                {/* BADGES */}
                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                  {value.achievements[0] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/1.png')}
                    />
                  ) : null}
                  {value.achievements[1] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/2.png')}
                    />
                  ) : null}
                  {value.achievements[2] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/3.png')}
                    />
                  ) : null}
                  {value.achievements[3] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/4.png')}
                    />
                  ) : null}
                  {value.achievements[4] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/5.png')}
                    />
                  ) : null}
                  {value.achievements[5] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/6.png')}
                    />
                  ) : null}
                  {value.achievements[6] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/7.png')}
                    />
                  ) : null}
                </View>

                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: 'Lato_400Regular',
                    marginBottom: 5,
                  }}
                >
                  {value.points.total} Points
                </Text>
              </View>
            </View>
          );
        } else {
          return (
            <View key={index} style={styles.listContainer}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ margin: 10 }}>
                  {index === 0 ? (
                    <View style={{ bottom: 65, right: 30 }}>
                      <LottieView
                        source={require('../animations/40243-fire-loop.json')}
                        autoPlay={true}
                        height={100}
                        width={100}
                        loop={true}
                      />
                    </View>
                  ) : null}
                  <Text style={styles.numberStyle}>#{index + 1}</Text>
                </View>
              </View>
              <View style={{ margin: 10 }}>
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    fontFamily: 'Lato_400Regular',
                    marginBottom: 5,
                  }}
                >
                  {value.firstName} {value.lastName}
                </Text>
                {/* BADGES */}
                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                  {value.achievements[0] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/1.png')}
                    />
                  ) : null}
                  {value.achievements[1] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/2.png')}
                    />
                  ) : null}
                  {value.achievements[2] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/3.png')}
                    />
                  ) : null}
                  {value.achievements[3] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/4.png')}
                    />
                  ) : null}
                  {value.achievements[4] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/5.png')}
                    />
                  ) : null}
                  {value.achievements[5] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/6.png')}
                    />
                  ) : null}
                  {value.achievements[6] === 'white' ? (
                    <Image
                      style={styles.badgeStyle}
                      source={require('../images/7.png')}
                    />
                  ) : null}
                </View>

                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: 'Lato_400Regular',
                    marginBottom: 5,
                  }}
                >
                  {value.points.total} Points
                </Text>
              </View>
            </View>
          );
        }
      });
    } else {
      return (
        <View>
          <Text>Leaderboards are empty</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Leaderboard</Text>
        </View>

        {usersActive ? (
          <View style={{ marginTop: 10 }}>
            <Leaderboard />
          </View>
        ) : (
          <View style={{ justifyContent: 'center', marginTop: 200 }}>
            <ActivityIndicator
              animating={loading}
              size='large'
              color='black'
              style={{ alignSelf: 'center' }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    marginTop: Constants.statusBarHeight,
  },
  textStyle: {
    alignSelf: 'center',
  },
  banner: {
    backgroundColor: colors.primary,
    paddingVertical: 25,
  },
  bannerText: {
    fontFamily: 'FjallaOne_400Regular',
    fontSize: 30,
    alignSelf: 'center',
  },
  listContainer: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: 'black',
    alignSelf: 'stretch',
  },
  numberStyle: {
    fontSize: 20,
    alignSelf: 'center',
    padding: 5,
    borderRadius: 100,
    fontFamily: 'Lato_400Regular',
  },
  badgeStyle: {
    height: 40,
    width: 40,
  },
});
export default LeaderboardScreen;
