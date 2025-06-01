const admin = require("firebase-admin");

// Path to your service account key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function fixImageUrls() {
  const petsRef = db.collection("pets");
  const snapshot = await petsRef.get();

  let fixedCount = 0;
  let removedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (data.imageUrl && typeof data.imageUrl === "object") {
      console.log(`Fixing doc ${doc.id}:`, data.imageUrl);

      if (data.imageUrl.secure_url && typeof data.imageUrl.secure_url === "string") {
        // Update imageUrl with secure_url string
        await doc.ref.update({ imageUrl: data.imageUrl.secure_url });
        console.log(`Updated imageUrl for doc ${doc.id}`);
        fixedCount++;
      } else {
        // Remove imageUrl if no valid secure_url found
        await doc.ref.update({ imageUrl: admin.firestore.FieldValue.delete() });
        console.log(`Removed invalid imageUrl for doc ${doc.id}`);
        removedCount++;
      }
    }
  }

  console.log(`Done! Fixed: ${fixedCount}, Removed: ${removedCount}`);
}

fixImageUrls().catch(console.error);
