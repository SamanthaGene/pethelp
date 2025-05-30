import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to PetPal 🐾</Text>
        <Text style={styles.subtitle}>Find your furry friends today!</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <MenuButton icon={<AntDesign name="pluscircleo" size={22} color="white" />} text="Add Pet" onPress={() => router.push("/add-pet")} />
        <MenuButton icon={<AntDesign name="heart" size={22} color="white" />} text="Favorites" onPress={() => router.push("/favorites")} />
        <MenuButton icon={<FontAwesome name="comments" size={22} color="white" />} text="Messages" onPress={() => router.push("/messages")} />
      </View>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Entypo name="log-out" size={20} color="white" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const MenuButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    {icon}
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    marginTop: 80,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 320,
    justifyContent: "center",
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
    }),
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
