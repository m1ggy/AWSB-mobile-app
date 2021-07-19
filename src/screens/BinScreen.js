import React from 'react'
import {View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ImageBackground} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';

const BinScreen = () =>{
    return (
        <View style={styles.viewStyle}>
            <Text style={styles.textStyle}>Bin Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   viewStyle:{
       flex:1,
       justifyContent:'center'
   },
   textStyle:{
    alignSelf:'center'
   }
})

export default BinScreen