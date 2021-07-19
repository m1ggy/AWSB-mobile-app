import React,{useState} from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'


const TutorialScreen = ({navigation}) =>{

  const slides = [
    {
      index: 1,
      title: 'Welcome to AWSB Mobile App!',
      subtitle: 'This is a tutorial. to skip this tutorial, press skip.',
      backgroundColor: 'white',
      image: <Image style={styles.imagesStyles}source={require('../../assets/splash.png')}/>
    },
    {
      index: 2,
      title: 'Home Screen',
      subtitle: 'In the home Screen, find the segregate button, this button allows you to let the Automatic waste segregation bin know you want to throw trash! under the segregate button, you will find your current score and the statistics tab',
      image: <Image style={styles.imagesStyles} source={require('../images/tuts1.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 3,
      title: 'Segregate!',
      subtitle: 'To segregate trash, simply let this QR Code be scanned by the Automatic Waste Segregation Bin',
      image: <Image style={styles.imagesStyles} source={require('../images/tuts2.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 4,
      title: 'Quiz Time',
      subtitle: 'Once the trash is segregated, you will be greeted by this quiz. answer correctly to get points!',
      image: <Image style={styles.imagesStyles} source={require('../images/tuts3.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 5,
      title: 'Points',
      subtitle: 'Get points if you answer the quiz correctly!',
      image: <Image style={styles.imagesStyles} source={require('../images/tuts4.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 6,
      title: 'Leaderboards',
      subtitle: 'Compete against others in the leaderboard! prove yourself to be the best segregator!',
      image: <Image style={styles.imagesStyles} source={require('../images/tuts5.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 7,
      title: 'Classroom',
      subtitle: 'Join a classroom! join your IRL classroom to let your teacher monitor your points.',
      image: <Image style={styles.imagesStyles} source={require('../images/tuts6.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 8,
      title: 'Classroom',
      subtitle: 'Join a classroom! join your IRL classroom to let your teacher monitor your points.',
      image: <Image style={styles.imagesStyles} source={require('../images/classroomstudent.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 9,
      title: 'Badges',
      subtitle: 'Earn Badges! let the competition know your achievements! segregate trash to earn badges. Your badges are displayed in the leaderboards',
      image: <Image style={styles.imagesStyles} source={require('../images/badges.png')}/>,
      backgroundColor: '#588da8',
    },
    {
      index: 10,
      title: 'For Teachers',
      image:<Image/>,
      subtitle: 'The following tutorial is for teachers. if you are a student, press Skip.',
      backgroundColor: '#f6ecf0',
    },
    {
      index: 11,
      title: 'Create Class',
      subtitle: 'Create classes where students can join.',
      image: <Image style={styles.imagesStyles} source={require('../images/newTeacher1.png')}/>,
      backgroundColor: '#f6ecf0',
    },
    {
      index: 12,
      title: 'Create Class',
      subtitle: 'Create classes where students can join. you can create multiple classes',
      image: <Image style={styles.imagesStyles} source={require('../images/newTeacher2.png')}/>,
      backgroundColor: '#f6ecf0',
    },
    {
      index: 13,
      title: 'View Classes',
      subtitle: 'View all your classes.',
      image: <Image style={styles.imagesStyles} source={require('../images/newTeacher3.png')}/>,
      backgroundColor: '#f6ecf0',
    },
    {
      index: 14,
      title: 'View Class',
      subtitle: 'Check on students who joined your class',
      image: <Image style={styles.imagesStyles} source={require('../images/newTeacher4.png')}/>,
      backgroundColor: '#f6ecf0',
    },
    {
      index: 15,
      title: 'Kick Students',
      subtitle: 'You can manually kick students inside the classroom',
      image: <Image style={styles.imagesStyles} source={require('../images/newTeacher5.png')}/>,
      backgroundColor: '#f6ecf0',
    }





  ];

    return (
        <Onboarding pages={slides} onDone={()=>{
            navigation.navigate('Home')
        }} onSkip={()=>{
            navigation.navigate('Home')
        }}/>
    )
}

const styles = StyleSheet.create({
    imagesStyles:{
      width:300,
      height:300,
      resizeMode:'contain'
    }
})

export default TutorialScreen