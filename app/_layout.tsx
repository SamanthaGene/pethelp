import { Stack } from "expo-router";

export default function Layout() {

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Login",
                    headerTitleStyle: {
                        color: '#333',
                        fontWeight: "bold",
                    }
                }}
            />
            <Stack.Screen
                name="add-pet"
                options={{
                    title: "Add New Pet",
                    headerTitleStyle: {
                        color: '#333',
                        fontWeight: "bold",
                    }
                }}
            />
            <Stack.Screen
                name="favorites"
                options={{
                    title: "My Favorites",
                    headerTitleStyle: {
                        color: '#333',
                        fontWeight: "bold",
                    }
                }}
            />
            <Stack.Screen
                name="home"
                options={{
                    title: "Home",
                    headerTitleStyle: {
                        color: '#333',
                        fontWeight: "bold",
                    }
                }}
            />
            <Stack.Screen
                name="adoption"
                options={{
                    title: "Adoption",
                    headerTitleStyle: {
                        color: '#333',
                        fontWeight: "bold",
                    }
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    title: "Register",
                    headerTitleStyle: {
                        color: '#333',
                        fontWeight: "bold",
                    }
                }}
            />
            <Stack.Screen
                name="pet/[id]"
                options={{
                    title: "Pet Details",
                    headerTitleStyle: {
                        color: '#333',
                        fontWeight: "bold",
                    }
                }}
            />
        </Stack>
    )
}