import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to view pet details.");
      setLoading(false);
      return;
    }

    const fetchPet = async () => {
      try {
        const petDoc = await getDoc(doc(db, "pets", id));
        if (petDoc.exists()) {
          setPet(petDoc.data());
        } else {
          Alert.alert("Error", "Pet not found.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load pet info.");
      } finally {
        setLoading(false);
      }
    };

    const checkIfFavorite = async () => {
      try {
        const favQuery = query(
          collection(db, "favorites"),
          where("userId", "==", auth.currentUser.uid),
          where("petId", "==", id)
        );
        const favSnap = await getDocs(favQuery);
        setIsFavorite(!favSnap.empty);
      } catch (error) {
        console.error("Failed to check favorites:", error);
      }
    };

    fetchPet();
    checkIfFavorite();
  }, [id]);

  const saveToFavorites = async () => {
  if (!auth.currentUser) {
    Alert.alert("Error", "You need to be logged in to save favorites.");
    return;
  }

  setSaving(true);
  try {
    // ✅ Check if already in favorites
    const favQuery = query(
      collection(db, "favorites"),
      where("userId", "==", auth.currentUser.uid),
      where("petId", "==", id)
    );
    const favSnap = await getDocs(favQuery);

    if (!favSnap.empty) {
      Alert.alert("Already a Favorite", "This pet is already in your favorites.");
      setIsFavorite(true);
      return;
    }

    await addDoc(collection(db, "favorites"), {
      userId: auth.currentUser.uid,
      petId: id,
      savedAt: new Date(),
    });

    Alert.alert("Added to favorites!");
    setIsFavorite(true);
  } catch (error) {
    Alert.alert("Error", error.message);
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading Pet Info...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#888", fontSize: 18 }}>Pet not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pet.imageUrl && (
        <Image
          source={{ uri: pet.imageUrl }}
          style={styles.petImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.info}>Type: {pet.type}</Text>
      <Text style={styles.info}>Age: {pet.age}</Text>

      {!isFavorite ? (
        <View style={styles.buttonContainer}>
          <Button
            title={saving ? "Saving..." : "💖 Save to Favorites"}
            onPress={saveToFavorites}
            color="#007AFF"
            disabled={saving}
          />
        </View>
      ) : (
        <Text style={styles.savedText}>❤️ Already in Favorites</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  petImage: {
    width: 250,
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 30,
    width: "100%",
  },
  savedText: {
    fontSize: 16,
    color: "green",
    marginTop: 20,
  },
});
