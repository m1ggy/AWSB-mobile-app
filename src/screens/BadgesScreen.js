import React, { useDebugValue, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Constants from 'expo-constants';
import { Image } from 'react-native-elements';
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const BadgesScreen = () => {
  /////PULL REFRESH
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      getUserInfo();
      setRefreshing(false);
    });
  }, []);

  const [credentials, setCredentials] = useState('');
  const getUserInfo = async () => {
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
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.viewStyle}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Banner />
        {credentials ? <Badges props={credentials.credentials} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const Banner = () => {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingVertical: 25,
        flex: 1,
      }}
    >
      <Text style={styles.textStyle}>Badges</Text>
    </View>
  );
};
const Badges = ({ props }) => {
  let achievements = [];
  ////the segregator 0
  if (props.points.total > 0) {
    achievements[0] = 'white';
  } else {
    achievements[0] = 'grey';
  }
  ////the big brain 1
  if (props.points.total > 0) {
    achievements[1] = 'white';
  } else {
    achievements[1] = 'grey';
  }
  ////junior segregator 2
  if (props.points.total >= 100) {
    achievements[2] = 'white';
  } else {
    achievements[2] = 'grey';
  }
  ////senior segregator 3
  if (props.points.total >= 500) {
    achievements[3] = 'white';
  } else {
    achievements[3] = 'grey';
  }
  ////segregator supreme 4
  if (props.points.total >= 1000) {
    achievements[4] = 'white';
  } else {
    achievements[4] = 'grey';
  }
  //// the king of the hill 5
  if (props.leader === true) {
    achievements[5] = 'white';
  } else {
    achievements[5] = 'grey';
  }
  /// double-double 6
  if (props.points.nonbio >= 10 && props.points.bio >= 10) {
    achievements[6] = 'white';
  } else {
    achievements[6] = 'grey';
  }

  firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.email)
    .update({
      achievements: achievements,
    });

  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={badgeListStatusStyle(achievements[0])}>
        {/*  */}

        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Image
            style={{ ...styles.badgeStyle }}
            source={require('../images/1.png')}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
        {/*  */}
        <View style={{ alignSelf: 'flex-start', marginHorizontal: 50 }}>
          <Text style={styles.badgeTitleStyle}>The Segregator</Text>
          <Text
            style={{
              ...styles.badgeTitleStyle,
              fontSize: 15,
              fontFamily: 'Lato_400Regular',
            }}
          >
            Segregate your first trash
          </Text>
        </View>
        <View style={{ alignSelf: 'center', marginHorizontal: 20 }}>
          {achievements[0] === 'white' ? (
            <Ionicons name='md-checkmark-circle' size={24} color='black' />
          ) : null}
        </View>
      </View>

      <View style={badgeListStatusStyle(achievements[1])}>
        {/*  */}
        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Image
            style={{ ...styles.badgeStyle }}
            source={require('../images/2.png')}
          />
        </View>
        {/*  */}

        <View style={{ alignSelf: 'center', marginHorizontal: 50 }}>
          <Text style={styles.badgeTitleStyle}>The Big Brain</Text>
          <Text
            style={{
              ...styles.badgeTitleStyle,
              fontSize: 15,
              fontFamily: 'Lato_400Regular',
            }}
          >
            Answer a quiz correctly
          </Text>
        </View>
        <View style={{ alignSelf: 'center', marginHorizontal: 30 }}>
          {achievements[1] === 'white' ? (
            <Ionicons name='md-checkmark-circle' size={24} color='black' />
          ) : null}
        </View>
      </View>

      <View style={badgeListStatusStyle(achievements[2])}>
        {/*  */}
        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Image
            style={{ ...styles.badgeStyle }}
            source={require('../images/3.png')}
          />
        </View>
        {/*  */}
        <View style={{ alignSelf: 'center', marginHorizontal: 50 }}>
          <Text style={styles.badgeTitleStyle}>Junior Segregator</Text>
          <Text
            style={{
              ...styles.badgeTitleStyle,
              fontSize: 15,
              fontFamily: 'Lato_400Regular',
            }}
          >
            Segregate 100 trash
          </Text>
        </View>
        <View style={{ alignSelf: 'center', marginHorizontal: 42 }}>
          {achievements[2] === 'white' ? (
            <Ionicons name='md-checkmark-circle' size={24} color='black' />
          ) : null}
        </View>
      </View>

      <View style={badgeListStatusStyle(achievements[3])}>
        {/*  */}
        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Image
            style={{ ...styles.badgeStyle }}
            source={require('../images/4.png')}
          />
        </View>
        {/*  */}
        <View style={{ alignSelf: 'center', marginHorizontal: 50 }}>
          <Text style={styles.badgeTitleStyle}>Senior Segregator</Text>
          <Text
            style={{
              ...styles.badgeTitleStyle,
              fontSize: 15,
              fontFamily: 'Lato_400Regular',
            }}
          >
            Segregate 500 trash
          </Text>
        </View>
        <View style={{ alignSelf: 'center', marginHorizontal: 40 }}>
          {achievements[3] === 'white' ? (
            <Ionicons name='md-checkmark-circle' size={24} color='black' />
          ) : null}
        </View>
      </View>

      <View style={badgeListStatusStyle(achievements[4])}>
        {/*  */}
        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Image
            style={{ ...styles.badgeStyle }}
            source={require('../images/5.png')}
          />
        </View>
        {/*  */}
        <View style={{ alignSelf: 'center', marginHorizontal: 50 }}>
          <Text style={styles.badgeTitleStyle}>Segregator Supreme</Text>
          <Text
            style={{
              ...styles.badgeTitleStyle,
              fontSize: 15,
              fontFamily: 'Lato_400Regular',
            }}
          >
            Segregate 1000 trash
          </Text>
        </View>
        <View style={{ alignSelf: 'center', marginHorizontal: 20 }}>
          {achievements[4] === 'white' ? (
            <Ionicons name='md-checkmark-circle' size={24} color='black' />
          ) : null}
        </View>
      </View>

      <View style={badgeListStatusStyle(achievements[5])}>
        {/*  */}
        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Image
            style={{ ...styles.badgeStyle }}
            source={require('../images/6.png')}
          />
        </View>
        {/*  */}
        <View style={{ alignSelf: 'center', marginHorizontal: 50 }}>
          <Text style={styles.badgeTitleStyle}>The King of the Hill</Text>
          <Text
            style={{
              ...styles.badgeTitleStyle,
              fontSize: 15,
              fontFamily: 'Lato_400Regular',
            }}
          >
            Be the #1 in the Leaderboards
          </Text>
        </View>
        <View style={{ alignSelf: 'flex-start', right: 15 }}>
          {achievements[5] === 'white' ? (
            <Ionicons name='md-checkmark-circle' size={24} color='black' />
          ) : null}
        </View>
      </View>
      <View style={badgeListStatusStyle(achievements[6])}>
        {/*  */}
        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Image
            style={{ ...styles.badgeStyle }}
            source={require('../images/7.png')}
          />
        </View>
        {/*  */}
        <View style={{ alignSelf: 'center', marginHorizontal: 50 }}>
          <Text style={styles.badgeTitleStyle}>Double-Double</Text>
          <Text
            style={{
              ...styles.badgeTitleStyle,
              fontSize: 15,
              fontFamily: 'Lato_400Regular',
            }}
          >
            Segregate 10 Biodegradable trash {'\n'}and 10 Non-Biodegradable
            trash
          </Text>
        </View>
        <View style={{ alignSelf: 'center', right: 45 }}>
          {achievements[6] === 'white' ? (
            <Ionicons name='md-checkmark-circle' size={24} color='black' />
          ) : null}
        </View>
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
    fontSize: 30,
    color: 'black',
    fontFamily: 'FjallaOne_400Regular',
  },
  badgeStyle: {
    height: 40,
    width: 40,
  },
  badgeTitleStyle: {
    fontSize: 20,
    alignSelf: 'flex-start',
    fontFamily: 'FjallaOne_400Regular',
    marginBottom: 5,
  },
});

const badgeListStatusStyle = function (options) {
  return {
    flexDirection: 'row',
    marginTop: 30,
    alignSelf: 'stretch',
    backgroundColor: options,
  };
};

export default BadgesScreen;
