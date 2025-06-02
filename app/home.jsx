import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();
  const q = query(collection(db, "pets"), where("adopted", "==", false));
  const [pets, setPets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchPetsAndFavorites = async () => {
      try {
        const petsSnap = await getDocs(q);
        const petsList = petsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPets(petsList);

        const favSnap = await getDocs(
          query(
            collection(db, "favorites"),
            where("userId", "==", auth.currentUser.uid)
          )
        );
        const favIds = favSnap.docs.map((doc) => doc.data().petId);
        setFavorites(favIds);
      } catch (error) {
        console.error("Error loading pets or favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPetsAndFavorites();
  }, []);

  const handleAddFavorite = async (petId) => {
    try {
      await addDoc(collection(db, "favorites"), {
        userId: auth.currentUser.uid,
        petId,
        savedAt: new Date(),
      });
      setFavorites((prev) => [...prev, petId]);
      Alert.alert("Added to favorites!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const renderPetItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/pet/${item.id}`)}>
      <View style={styles.petCard}>
        {item.imageUrl && typeof item.imageUrl === "string" && (
          <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.petName}>{item.name}</Text>
          <Text style={styles.petInfo}>{item.type} • {item.age}</Text>
          {!favorites.includes(item.id) ? (
            <Text style={styles.addFavBtn}>💖 Tap to View</Text>
          ) : (
            <Text style={styles.addedFavText}>❤️ In Favorites</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to PetPal 🐾</Text>
        <Text style={styles.subtitle}>Find your furry friends today!</Text>
      </View>

      {userProfile && (
        <View style={styles.userProfile}>
          <View>
            {userProfile.username && (
              <Text style={styles.username}>{userProfile.username}</Text>
            )}
            <Text style={styles.emailText}>{userProfile.email}</Text>
          </View>
          {userProfile.profileImage ? (
            <Image source={{ uri: userProfile.profileImage }} style={styles.avatar} />
          ) : (
            <FontAwesome name="user-circle" size={36} color="#888" />
          )}
        </View>
      )}


      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPetItem}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}

      <View style={styles.buttonsContainer}>
        <MenuButton icon={<AntDesign name="pluscircleo" size={22} color="white" />} text="Add Pet" onPress={() => router.push("/add-pet")} />
        <MenuButton icon={<AntDesign name="heart" size={22} color="white" />} text="Favorites" onPress={() => router.push("/favorites")} />
        <MenuButton icon={<FontAwesome name="paw" size={22} color="white" />} text="Adoption" onPress={() => router.push("/adoption")} />
      </View>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Entypo name="log-out" size={20} color="white" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const MenuButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={[styles.button, { marginBottom: 16 }]} onPress={onPress}>
    <View style={styles.buttonIcon}>{icon}</View>
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
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 320,
    justifyContent: "center",
    alignSelf: "center",
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
    }),
  },
  buttonIcon: {
    marginRight: 12,
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
  petCard: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginHorizontal: 10,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  petName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  petInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  addFavBtn: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  addedFavText: {
    color: "green",
    fontSize: 14,
    fontWeight: "600",
  },
  userProfile: {
    position: "absolute",
    top: 50,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  username: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
  },
  emailText: {
    fontSize: 12,
    color: "#888",
  },
});
