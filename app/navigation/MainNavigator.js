import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from '../screens/Main'
import AddScreen from '../screens/Add';
import SaveScreen from '../screens/Save'
import CommentScreen from '../screens/Comment'
import {Button} from 'react-native-paper'

const Stack = createStackNavigator();

const MainNavigator = (props) => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} options={{
            headerShown: false
        }}></Stack.Screen>
        <Stack.Screen name="Add" component={AddScreen} navigation={props.navigation} options={{
            headerShown: false
        }}></Stack.Screen>
        <Stack.Screen name="Save" component={SaveScreen} navigation={props.navigation} options={{
            headerShown: false
        }}></Stack.Screen>
        <Stack.Screen name="Comment" component={CommentScreen} navigation={props.navigation} ></Stack.Screen>
    </Stack.Navigator>
);
export default MainNavigator;