import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "../components/auth/Landing";
import RegisterScreen from "../components/auth/register/RegisterScreen";
import LoginScreen from "../components/auth/login/LoginScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
    <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} options={{
            headerShown: false
        }}></Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} options={{
            headerShown: false
        }}></Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} options={{
            headerShown: false
        }}></Stack.Screen>
    </Stack.Navigator>
);
export default AppNavigator;