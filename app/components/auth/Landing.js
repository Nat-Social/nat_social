import React from 'react';
import { Text, View, Button } from 'react-native'
import AppButton from '../appbutton/AppButton';

export default function Landing({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppButton title="Register" onPress={() => navigation.navigate("Register")}/>
            <AppButton title="Login" onPress={() => navigation.navigate("Login")}/>
        </View>
    )
}

