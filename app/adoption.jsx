import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

export default function AdoptionScreen() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "pets"), where("adopted", "==", false));
      const snapshot = await getDocs(q);
      const petsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsList);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch pets.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAdopt = async (petId) => {
    try {
      const petRef = doc(db, "pets", petId);
      await updateDoc(petRef, {
        adopted: true,
        adoptedBy: auth.currentUser?.uid || "unknown-user",
        adoptedAt: new Date(),
      });
      setPets((prev) => prev.filter((pet) => pet.id !== petId));
      Alert.alert("Success", "You adopted a pet! 🎉");
    } catch (err) {
      Alert.alert("Error", "Adoption failed.");
      console.error(err);
    }
  };

  const renderPet = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>
        {item.type} • {item.age} yrs
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => handleAdopt(item.id)}>
        <Text style={styles.buttonText}>Adopt</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adopt a Pet 🐾</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPet}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
