import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
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
            pets.push({ id: petId, ...petDoc.data() });
          }
        }
        setFavorites(pets);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorite Pets</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>You haven’t saved any pets yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/pet/${item.id}`)}
              style={styles.card}
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
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    marginBottom: 12,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  petDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
