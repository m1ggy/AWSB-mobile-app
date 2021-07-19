import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import homeNavigator from './homeNavigator'

import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'

const Stack = createStackNavigator();

 const authNavigator = () =>{
    return (
        <Stack.Navigator >
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
          <Stack.Screen name="Register" component={RegisterScreen}/>
          <Stack.Screen name="Home" component={homeNavigator} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
  }

  export default authNavigator