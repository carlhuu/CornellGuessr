import express from "express";
import cors from "cors";
import { db } from "./firebase";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// GET: Fetch all guesses
app.get("/api/guesses", async (req, res) => {
  try {
    const snapshot = await db.collection("guesses").orderBy("timestamp", "desc").get();
    const guesses = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: new Date(data.timestamp).toLocaleString(),
      };
});
    res.status(200).json({ guesses });
  } catch (err) {
    console.error("Error fetching guesses:", err);
    res.status(500).json({ message: "Failed to fetch guesses." });
  }
});

// POST: Submit a new guess
app.post("/api/guesses", async (req, res) => {
  const { lat, lng, userId, displayName } = req.body;

  if (!lat || !lng || !userId || !displayName) {
    return res.status(400).json({ message: "Invalid guess data." });
  }

  const timestamp = Date.now();
  const guess = { lat, lng, userId, displayName, timestamp };

  const customId = `guess_${userId}_${timestamp}`;

  try {
    const docRef = db.collection("guesses").doc(customId);
    await docRef.set(guess);
    res.status(201).json({ message: "Guess saved!", guessId: customId, guess });
  } catch (err) {
    console.error("Error saving guess:", err);
    res.status(500).json({ message: "Failed to save guess." });
  }
});

// PUT: Update the latest guess of a user
app.put("/api/guesses/:userId", async (req, res) => {
  const { userId } = req.params;
  const { lat, lng } = req.body;

  try {
    const snapshot = await db.collection("guesses").where("userId", "==", userId).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Guess not found." });
    }

    const doc = snapshot.docs[0]; // Only update the first found guess
    await db.collection("guesses").doc(doc.id).update({
      lat,
      lng,
      timestamp: Date.now()
    });

    res.status(200).json({ message: "Guess updated." });

  } catch (err) {
    console.error("Error updating guess:", err);
    res.status(500).json({ message: "Failed to update guess." });
  }
});

// DELETE: Remove all guesses of a user
app.delete("/api/guesses/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db.collection("guesses").where("userId", "==", userId).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No guesses found for user." });
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    res.status(200).json({ message: "Guesses deleted for user." });

  } catch (err) {
    console.error("Error deleting guesses:", err);
    res.status(500).json({ message: "Failed to delete guesses." });
  }
});

// POST: input all stats
app.post("/api/stats", async (req, res) => {
  const { total_pts, userId} = req.body;
  if (!total_pts || !userId) {
    return res.status(400).json({ message: "Invalid guess data." });
  }

  const guess = { total_pts, userId, timestamp: Date.now() };

  try {
    const docRef = await db.collection("stats").add(guess);
    res.status(201).json({ message: "Stats saved!", guessId: docRef.id, guess });
  } catch (err) {
    console.error("Error saving stats:", err);
    res.status(500).json({ message: "Failed to save stats." });
  }
});

// GET: Fetch all stats
app.get("/api/stats", async (req, res) => {
  try {
    const snapshot = await db.collection("stats").orderBy("timestamp", "desc").get();
    const stats = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: new Date(data.timestamp).toLocaleString(),
      };
    });
    res.status(200).json({ stats });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
}); 

// is it running

app.get("/", (req, res) => {
  res.send("Backend is running 🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰");
})

// Start server 
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});