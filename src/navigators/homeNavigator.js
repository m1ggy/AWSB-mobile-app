import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import React from 'react'
import {Ionicons} from '@expo/vector-icons'
import { SimpleLineIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ClassroomScreen from '../screens/ClassroomScreen'
import LeaderboardScreen from '../screens/LeaderboardScreen'
import BadgesScreen from '../screens/BadgesScreen'

const Tab = createMaterialBottomTabNavigator();

const homeNavigator = ({user}) =>{
    return(
        <Tab.Navigator
        initialRouteName="Home"
        activeColor="black"
        shifting={false}
        barStyle={{ backgroundColor: 'white' }}
       options={{
         showIcon:true
       }}
      >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon:() => (<Ionicons name="md-home" size={20} color="black"/>
          )
          
        }}
        initialParams={user}
      />   
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{
      tabBarIcon: ()=>(<Ionicons name="ios-list" size={24} color="black"/>)
      }}/>
      <Tab.Screen name="Classroom" component={ClassroomScreen} options={{
        tabBarIcon : () =>(<Ionicons name="md-people" size={20} color="black" />)
        }}/>
      <Tab.Screen name="Badges" component={BadgesScreen} options={{
        tabBarIcon : () =>(<SimpleLineIcons name="badge" size={20} color="black" />)
        }}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarIcon: () =>(<Ionicons name="md-settings" size={20} color="black"/>)
      }}/>
      
      </Tab.Navigator>  
    )
  }

  export default homeNavigator