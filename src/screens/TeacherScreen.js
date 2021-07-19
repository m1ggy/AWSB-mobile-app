import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import firebase from 'firebase';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const TeacherScreen = () => {
  const [modalToggles, setModalToggles] = useState([]);
  const [credentials, setCredentials] = useState(false);
  const [members, setMembers] = useState(false);
  const [addClassToggle, setAddClassToggle] = useState(false);
  const [newClass, setNewClass] = useState('');
  const toggleRef = useRef();
  const textRef = useRef();
  const joinRef = useRef();
  const [joinClassToggle, setJoinClassToggle] = useState(false);
  toggleRef.current = false;
  /////PULL REFRESH
  const [refreshing, setRefreshing] = React.useState(false);

  const classRef = firebase.firestore().collection('class');
  const userRef = firebase.firestore().collection('users');
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      getUserInfo();
      setRefreshing(false);
    });
  }, []);

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
          getMemberList(docRef.data());
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const createClass = async () => {
    const snapshot = await classRef
      .where('classname', '==', textRef.current)
      .get();
    if (snapshot.empty) {
      Alert.alert('Success', 'Class Created!', [{ text: 'OK' }]);
      classRef.doc(textRef.current).set({
        teacher: credentials.credentials.email,
        classname: textRef.current,
        members: [],
      });
      userRef.doc(credentials.credentials.email).update({
        classname: firebase.firestore.FieldValue.arrayUnion(textRef.current),
      });
      getUserInfo();
      setAddClassToggle(false);
    } else if (!snapshot.empty) {
      Alert.alert('Oops...', 'Class already exists!', [{ text: 'OK' }]);
    }
  };

  const modalToggleHelper = (index, changes) => {
    let toggles = [...modalToggles];
    let toggle = [toggles[index]];
    toggle = changes;
    toggles[index] = toggle;
    setModalToggles(toggles);
  };
  const toggleHelper = (param) => {
    if (param) {
      if (param.length > 0) {
        return param;
      }
    } else {
      return false;
    }
  };
  const getMemberList = async (value) => {
    if (typeof value.classname != 'undefined') {
      let tempArray = [];
      let bigArray = [];
      for (let i = 0; i <= value.classname.length; ++i) {
        const querySnapshot = await userRef
          .where('classname', '==', `${value.classname[i]}`)
          .get();
        if (querySnapshot.empty) {
          bigArray.push(tempArray);
          tempArray = [];
        } else {
          querySnapshot.forEach((doc) => {
            tempArray.push({
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              points: doc.data().points.total,
              email: doc.data().email,
            });
          });
          bigArray.push(tempArray);
          tempArray = [];
        }
      }
      console.log(bigArray);
      setMembers(bigArray);
      console.log('Current members: ' + members);
    } else {
      return null;
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const leaveclassHelper = (params) => {
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to leave this class?',
      [
        {
          text: 'Yes',
          onPress: () => {
            userRef.doc(credentials.credentials.email).update({
              classname: firebase.firestore.FieldValue.arrayRemove(
                credentials.credentials.classname[params]
              ),
            });
            classRef.doc(credentials.credentials.classname[params]).update({
              teacher: firebase.firestore.FieldValue.delete(),
            });
            return Alert.alert('Success', 'Successfully left classroom', [
              {
                text: 'OK',
                onPress: () => {
                  getUserInfo();
                  modalToggleHelper(params, false);
                },
              },
            ]);
          },
        },
        {
          text: 'Cancel',
        },
      ]
    );
  };

  const joinClassHelper = async () => {
    const classSnapshot = await classRef
      .where('classname', '==', joinRef.current)
      .get();

    if (classSnapshot.empty) {
      Alert.alert(
        'Oops...',
        'Entered Class does not exist! do you want to create it instead?',
        [
          {
            text: 'Yes',
            onPress: () => {
              classRef.doc(joinRef.current).set({
                teacher: credentials.credentials.email,
                classname: joinRef.current,
                members: [],
              });
              userRef.doc(credentials.credentials.email).update({
                classname: firebase.firestore.FieldValue.arrayUnion(
                  joinRef.current
                ),
              });
              Alert.alert('Success', 'Class created!', [
                {
                  text: 'OK',
                  onPress: () => {
                    getUserInfo();
                  },
                },
              ]);
            },
          },
          {
            text: 'Cancel',
          },
        ],
        { cancelable: true }
      );
    } else {
      classSnapshot.forEach((doc) => {
        if (typeof doc.data().teacher == 'undefined') {
          classRef.doc(doc.data().classname).set(
            {
              teacher: credentials.credentials.email,
            },
            { merge: true }
          );
          userRef.doc(credentials.credentials.email).update({
            classname: firebase.firestore.FieldValue.arrayUnion(
              joinRef.current
            ),
          });
          Alert.alert('Success', 'Successfully joined the class!', [
            {
              text: 'OK',
              onPress: () => {
                getUserInfo();
                setJoinClassToggle(false);
              },
            },
          ]);
        } else {
          Alert.alert('Oops....', 'This class already has a teacher', [
            { text: 'OK' },
          ]);
        }
      });
    }
  };

  const kickUserHelper = async (index, i, classname) => {
    console.log(JSON.stringify(members[index][i]));

    Alert.alert(
      'Confirm Action',
      'Do you want to kick this user from the classroom?',
      [
        {
          text: 'Yes',
          onPress: () => {
            userRef
              .doc(
                JSON.stringify(members[index][i].email).replace(/['"]+/g, '')
              )
              .update({
                classname: firebase.firestore.FieldValue.delete(),
              });
            classRef.doc(classname).update({
              members: firebase.firestore.FieldValue.arrayRemove(
                JSON.stringify(members[index][i].email).replace(/['"]+/g, '')
              ),
            });

            Alert.alert('Success', 'User successfully kicked', [
              {
                text: 'OK',
                onPress: () => {
                  getUserInfo();
                },
              },
            ]);
          },
        },
        {
          text: 'Cancel',
        },
      ]
    );
  };

  const ClassComponent = () => {
    return (
      <View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            width: 150,
            alignSelf: 'center',
            height: 50,
            justifyContent: 'center',
            backgroundColor: '#8db596',
            borderColor: '#8db596',
            marginTop: 10,
          }}
          onPress={() => {
            setAddClassToggle(true);
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 18,
              fontFamily: 'FjallaOne_400Regular',
            }}
          >
            Add new class
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            width: 150,
            alignSelf: 'center',
            height: 50,
            justifyContent: 'center',
            backgroundColor: '#8db596',
            borderColor: '#8db596',
            marginTop: 10,
          }}
          onPress={() => {
            setJoinClassToggle(true);
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 18,
              fontFamily: 'FjallaOne_400Regular',
            }}
          >
            Join a Class
          </Text>
        </TouchableOpacity>
        {credentials.credentials.classname.length == 0 ? (
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ alignSelf: 'center', marginTop: 25 }}>
              No Current Class
            </Text>
          </View>
        ) : (
          <ClassListComponent />
        )}

        {/* JOIN CLASS MODAL */}
        <Modal
          animationType='fade'
          transparent={true}
          visible={joinClassToggle}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 18,
                    fontFamily: 'FjallaOne_400Regular',
                  }}
                >
                  Join Existing Class
                </Text>
                <View style={{ margin: 20 }}>
                  <Text style={{ alignSelf: 'center' }}>Enter Class Name:</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      width: 300,
                    }}
                    onChangeText={(value) => {
                      joinRef.current = value;
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      width: 100,
                      alignSelf: 'center',
                      height: 50,
                      justifyContent: 'center',
                      backgroundColor: '#e0ece4',
                      borderColor: '#e0ece4',
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 14,
                        fontFamily: 'FjallaOne_400Regular',
                      }}
                      onPress={() => {
                        joinClassHelper();
                      }}
                    >
                      Join Class
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setJoinClassToggle(false);
                  }}
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#df7861',
                    borderColor: '#df7861',
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: 'white' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* MODAL FOR CREATING CLASS */}
        <Modal animationType='fade' transparent={true} visible={addClassToggle}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 18,
                    fontFamily: 'FjallaOne_400Regular',
                  }}
                >
                  Add New Class
                </Text>
                <View style={{ margin: 20 }}>
                  <Text style={{ alignSelf: 'center' }}>Enter Class Name:</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      width: 300,
                    }}
                    onChangeText={(value) => {
                      textRef.current = value;
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      width: 100,
                      alignSelf: 'center',
                      height: 50,
                      justifyContent: 'center',
                      backgroundColor: '#e0ece4',
                      borderColor: '#e0ece4',
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 14,
                        fontFamily: 'FjallaOne_400Regular',
                      }}
                      onPress={() => {
                        createClass(textRef.current);
                      }}
                    >
                      Create Class
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setAddClassToggle(false);
                  }}
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#df7861',
                    borderColor: '#df7861',
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: 'white' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  const GeneratedMemberListComponent = (props) => {
    console.log(JSON.stringify(members));
    if (typeof members[props.index] != 'undefined') {
      if (members[props.index].length < 1) {
        return <Text>Class is empty :(</Text>;
      } else {
        return members[props.index].map((value, i) => {
          return (
            <View key={i} style={{ marginVertical: 10 }}>
              <View
                style={{ borderTopWidth: 1, flexDirection: 'row', padding: 20 }}
              >
                <View style={{ justifyContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      kickUserHelper(props.index, i, props.classname);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      backgroundColor: '#df7861',
                      borderColor: '#df7861',
                      marginRight: 10,
                      paddingVertical: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ alignSelf: 'center' }}>Kick</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ fontSize: 18 }}>
                    {value.firstName} {value.lastName}
                  </Text>
                  <Text>
                    <Text
                      style={{
                        fontFamily: 'FjallaOne_400Regular',
                        fontSize: 16,
                      }}
                    >
                      {value.points}
                    </Text>{' '}
                    Points
                  </Text>
                </View>
              </View>
            </View>
          );
        });
      }
    } else {
      return <Text>undefined</Text>;
    }
  };
  const renderHelper = (index, class_name) => {
    if (typeof members[index] != 'undefined') {
      if (members[index].length > 0) {
        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <GeneratedMemberListComponent
              index={index}
              classname={class_name}
            />
          </ScrollView>
        );
      } else {
        return (
          <ScrollView>
            <Text style={{ alignSelf: 'center', marginTop: 50 }}>
              No Members
            </Text>
          </ScrollView>
        );
      }
    } else {
      return <Text>undefined</Text>;
    }
  };
  const GeneratedClassListComponent = () => {
    return credentials.credentials.classname.map((class_name, index) => {
      return (
        <View key={index} style={{ alignSelf: 'stretch', marginVertical: 10 }}>
          <TouchableOpacity
            onPress={() => {
              modalToggleHelper(index, true);
            }}
            style={{
              backgroundColor: '#a7c5eb',
              height: 50,
              borderRadius: 10,
              width: 300,
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 18,
                fontFamily: 'FjallaOne_400Regular',
                marginVertical: 15,
              }}
            >
              {class_name}
            </Text>
            <Modal
              animationType='fade'
              transparent={true}
              visible={toggleHelper(modalToggles[index])}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ alignSelf: 'stretch', width: 300 }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontFamily: 'FjallaOne_400Regular',
                      }}
                    >
                      {class_name}
                    </Text>
                  </View>

                  <Text>Members:</Text>
                  {renderHelper(index, class_name)}
                  <TouchableOpacity
                    onPress={() => {
                      leaveclassHelper(index);
                    }}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#df7861',
                      borderColor: '#df7861',
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                      marginVertical: 20,
                    }}
                  >
                    <Text style={{ color: 'white' }}>Leave Class</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      modalToggleHelper(index, false);
                    }}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#df7861',
                      borderColor: '#df7861',
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: 'white' }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
      );
    });
  };
  const ClassListComponent = () => {
    let array = [];
    if (credentials) {
      if (
        modalToggles.length == 0 &&
        credentials.credentials.classname.length > 0
      ) {
        console.log(credentials.credentials.classname.length);
        credentials.credentials.classname.forEach((index) => {
          array.push(false);
          console.log(array);
          if (index === credentials.credentials.classname.length - 1) {
            setModalToggles(array);
          }
        });
      }

      return (
        <View>
          {credentials.credentials.classname.length > 0 ? (
            <GeneratedClassListComponent />
          ) : (
            <Text style={{ alignSelf: 'center', marginVertical: 25 }}>
              No active class
            </Text>
          )}
        </View>
      );
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
        {credentials ? <ClassComponent /> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flexGrow: 1,
    marginTop: Constants.statusBarHeight,
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
});

export default TeacherScreen;
