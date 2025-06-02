import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dhaotosay/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "pethelp";
  const router = useRouter();

  const pickImage = async () => {
    if (uploading) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("file", blob, "upload.jpg");
    } else {
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
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

    return data.secure_url;
  };

  const handleRegister = async () => {
    if (!email.includes("@") || !password) {
      Alert.alert("Invalid Input", "Please enter a valid email and password.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setUploading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      await setDoc(doc(db, "users", userId), {
        email,
        username,
        profileImage: imageUrl,
        createdAt: new Date(),
      });


      Alert.alert("Success", "Account created!");
      router.replace("/home");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", error.message || "Failed to register.");
    } finally {
      setUploading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />


      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerButtonText}>
          {image ? "Change Profile Picture" : "Pick Profile Picture"}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}
      {uploading && <Text style={{ marginBottom: 16 }}>Uploading...</Text>}

      <TouchableOpacity
        style={[styles.submitButton, uploading && { backgroundColor: "#ccc" }]}
        onPress={handleRegister}
        disabled={uploading}
      >
        <Text style={styles.submitButtonText}>
          {uploading ? "Registering..." : "Register"}
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
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 40,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  imagePickerButton: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  submitButton: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#28A745",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
