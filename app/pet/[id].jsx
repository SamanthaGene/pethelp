import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      const petDoc = await getDoc(doc(db, "pets", id));
      if (petDoc.exists()) {
        setPet(petDoc.data());
      }
    };

    const checkIfFavorite = async () => {
      const favQuery = query(
        collection(db, "favorites"),
        where("userId", "==", auth.currentUser.uid),
        where("petId", "==", id)
      );
      const favSnap = await getDocs(favQuery);
      setIsFavorite(!favSnap.empty);
    };

    fetchPet();
    checkIfFavorite();
  }, [id]);

  const saveToFavorites = async () => {
    try {
      await addDoc(collection(db, "favorites"), {
        userId: auth.currentUser.uid,
        petId: id,
        savedAt: new Date(),
      });
      Alert.alert("Added to favorites!");
      setIsFavorite(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (!pet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading Pet Info...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.info}>Type: {pet.type}</Text>
      <Text style={styles.info}>Age: {pet.age}</Text>

      {!isFavorite ? (
        <View style={styles.buttonContainer}>
          <Button title="💖 Save to Favorites" onPress={saveToFavorites} color="#007AFF" />
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
