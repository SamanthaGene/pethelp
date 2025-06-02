import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const favQuery = query(
        collection(db, "favorites"),
        where("userId", "==", auth.currentUser.uid)
      );
      const favSnap = await getDocs(favQuery);

      const pets = [];
      for (const favDoc of favSnap.docs) {
        const petId = favDoc.data().petId;
        const petDoc = await getDoc(doc(db, "pets", petId));
        if (petDoc.exists()) {
          const petData = petDoc.data();
          if (!petData.adopted) {
            pets.push({ id: petId, ...petData });
          }
        }
      }
      setFavorites(pets);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites 🐾</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyText}>You haven’t saved any pets yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/pet/${item.id}`)}
              style={styles.card}
              activeOpacity={0.85}
            >
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              )}
              <View style={styles.info}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petDetails}>
                  {item.type} • {item.age} yrs
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  petDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
