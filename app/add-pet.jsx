import * as ImagePicker from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "../firebaseConfig";

export default function AddPetScreen() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dhaotosay/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "pethelp";
  const router = useRouter();

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

  const handleAddPet = async () => {
    if (!name || !type || !age) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = null;

      if (image) {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // Web requires fetching the image blob
    const response = await fetch(image);
    const blob = await response.blob();
    formData.append("file", blob, "upload.jpg");
  } else {
    // Mobile (iOS/Android) supports direct uri upload
    formData.append("file", {
      uri: Platform.OS === "ios" ? image.replace("file://", "") : image,
      type: "image/jpeg",
      name: "upload.jpg",
    });
  }

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  imageUrl = data.secure_url;
}

      const petData = {
        name,
        type,
        age,
        adopted: false,
        createdAt: new Date(),
      };

      if (imageUrl) {
        petData.imageUrl = imageUrl;
      }

      await addDoc(collection(db, "pets"), petData);

      setName("");
      setType("");
      setAge("");
      setImage(null);
      router.back();
    } catch (error) {
      console.error("Error adding pet: ", error);
      Alert.alert("Error", "Failed to add pet. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add a New Pet 🐶</Text>

      <TextInput
        placeholder="Pet Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Type (e.g., Dog, Cat)"
        value={type}
        onChangeText={setType}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerButtonText}>
          {image ? "Change Photo" : "Pick a Photo"}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {uploading && (
        <Text style={{ marginBottom: 16 }}>Uploading...</Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleAddPet} disabled={uploading}>
        <Text style={styles.submitButtonText}>
          {uploading ? "Submitting..." : "Submit Pet"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  imagePickerButton: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#007AFF",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  imagePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#eee",
  },
  submitButton: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#34C759",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 40,
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: "#34C759",
        shadowOpacity: 0.35,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
