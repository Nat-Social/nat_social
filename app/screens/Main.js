import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUsersFollowing, clearData } from '../redux/actions'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import firebase from 'firebase'

import FeedScreen from './Feed'
import ProfileScreen from './Profile'
import AddScreen from './Add'
import SearchScreen from './Search'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}
export class Main extends Component {

    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUsersFollowing();
    }

    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false} screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Feed':
                            iconName = 'home'
                            break;
                        case 'Search':
                            iconName = 'magnify'
                            break
                        case 'MainAdd':
                            iconName = 'plus-circle-outline'
                            break
                        case 'Profile':
                            iconName = 'account'
                            break
                    }

                    // You can return any component that you like here!
                    return <MaterialCommunityIcons name={iconName} color={focused ? 'purple' : '#FFFFFF'} size={26} />;
                }
            })}>
                <Tab.Screen name="Feed" component={FeedScreen} options={{
                    headerShown: false
                }}></Tab.Screen>
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        headerShown: false
                    }}></Tab.Screen>
                <Tab.Screen name="MainAdd" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        headerShown: false
                    }}></Tab.Screen>
                <Tab.Screen name="Profile"
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    component={ProfileScreen}
                    options={{
                        headerShown: false
                    }}></Tab.Screen>
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUsersFollowing, clearData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
