import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import homeNavigator from './homeNavigator'
import TutorialScreen from '../screens/TutorialScreen'
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

 const tutorialNavigator = () =>{
    return (
        <Stack.Navigator >
          <Stack.Screen name="Tutorial" component={TutorialScreen} options={{headerShown:false}} />
          <Stack.Screen name="Home" component={homeNavigator} options={{headerShown:false}}/>
          <Stack.Screen name="Settings" component ={SettingsScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
  }

  export default tutorialNavigator