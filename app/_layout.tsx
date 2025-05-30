import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";

export default function Layout () {

    return (
        <Tabs>
            <Tabs.Screen 
                name="index"
                options={{
                    title: "Login",
                    tabBarIcon: ({ color }) => 
                        <MaterialIcons size={28} name="alarm-add" color={color} />,
                        tabBarActiveTintColor: '#0b5345',
                        headerTitleStyle: {
                            color: '#0b5345',
                            fontWeight: "bold",
                        }
                }}
            />
            <Tabs.Screen 
                name="add-pet"
                options={{
                    title: "Add Pet",
                    tabBarIcon: ({ color }) => 
                        <MaterialIcons size={28} name="9mp" color={color} />,
                        tabBarActiveTintColor: '#0b5345',
                        headerTitleStyle: {
                            color: '#0b5345',
                            fontWeight: "bold",
                        }
                }}
            />

            <Tabs.Screen 
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color }) => 
                        <MaterialIcons size={28} name="9mp" color={color} />,
                        tabBarActiveTintColor: '#0b5345',
                        headerTitleStyle: {
                            color: '#0b5345',
                            fontWeight: "bold",
                        }
                }}
            />

            <Tabs.Screen 
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => 
                        <MaterialIcons size={28} name="9mp" color={color} />,
                        tabBarActiveTintColor: '#0b5345',
                        headerTitleStyle: {
                            color: '#0b5345',
                            fontWeight: "bold",
                        }
                }}
            />

            <Tabs.Screen 
                name="register"
                options={{
                    title: "Register",
                    tabBarIcon: ({ color }) => 
                        <MaterialIcons size={28} name="9mp" color={color} />,
                        tabBarActiveTintColor: '#0b5345',
                        headerTitleStyle: {
                            color: '#0b5345',
                            fontWeight: "bold",
                        }
                }}
            />

            <Tabs.Screen 
                name="messages"
                options={{
                    title: "Messages",
                    tabBarIcon: ({ color }) => 
                        <MaterialIcons size={28} name="9mp" color={color} />,
                        tabBarActiveTintColor: '#0b5345',
                        headerTitleStyle: {
                            color: '#0b5345',
                            fontWeight: "bold",
                        }
                }}
            />
        </Tabs>
    )
}