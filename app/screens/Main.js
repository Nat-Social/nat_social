import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUsersFollowing, clearData} from '../redux/actions'
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
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={FeedScreen} options={{
                    tabBarIcon: (({ color, size }) =>
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                    headerShown: false
                }}></Tab.Screen>
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: (({ color, size }) =>
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        ),
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
                        tabBarIcon: (({ color, size }) =>
                            <MaterialCommunityIcons name="plus-circle-outline" color={color} size={26} />
                        ),
                        headerShown: false
                    }}></Tab.Screen>
                <Tab.Screen name="Profile"
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            console.log(firebase.auth().currentUser.uid)
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: (({ color, size }) =>
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
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
