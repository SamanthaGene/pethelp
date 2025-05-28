import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, Image, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddPetScreen() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `${Date.now()}.jpg`;
    const storage = getStorage();
    const imageRef = ref(storage, `pet_images/${filename}`);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleAddPet = async () => {
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageAsync(image);
      }

      await addDoc(collection(db, "pets"), {
        name,
        type,
        age,
        imageUrl,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Pet added successfully!");
      setName("");
      setType("");
      setAge("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add a Pet</Text>

      <TextInput
        placeholder="Pet Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Type (e.g. Dog, Cat)"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Pick a Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Submit Pet" onPress={handleAddPet} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
});
