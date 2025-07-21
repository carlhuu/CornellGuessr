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

    const doc = snapshot.docs[0];
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

// POST: input one game stat
app.post("/api/stats", async (req, res) => {
  const { total_pts, userId, displayName } = req.body;
  if (total_pts === undefined || !userId || !displayName) {
    return res.status(400).json({ message: "Invalid stats data." });
  }

  const stat = {
    total_pts,
    userId,
    displayName,
    timestamp: Date.now(),
  };

  try {
    const docRef = await db.collection("stats").add(stat);
    res.status(201).json({ message: "Stats saved!", statId: docRef.id, stat });
  } catch (err) {
    console.error("Error saving stats:", err);
    res.status(500).json({ message: "Failed to save stats." });
  }
});

// GET: Fetch summary for a specific user
app.get("/api/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db.collection("stats").where("userId", "==", userId).get();
    if (snapshot.empty) {
      return res.status(200).json({ total_pts: 0, total_games: 0, high_score: 0 });
    }

    const statsArray = snapshot.docs.map(doc => doc.data());
    const total_pts = statsArray.reduce((sum, s) => sum + s.total_pts, 0);
    const total_games = statsArray.length;
    const high_score = Math.max(...statsArray.map(s => s.total_pts));

    res.status(200).json({ total_pts, total_games, high_score });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

// GET: Fetch all stats (leaderboard)
app.get("/api/stats", async (req, res) => {
  try {
    const snapshot = await db.collection("stats").orderBy("total_pts", "desc").limit(100).get();
    const leaderboard = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userID: data.userId,
        displayName: data.displayName || "Guest",
        total_pts: data.total_pts,
        date: new Date(data.timestamp).toLocaleString(),
      };
    });
    res.status(200).json({ leaderboard });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard." });
  }
});

// is it running
app.get("/", (req, res) => {
  res.send("Backend is running 🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰");
});

// 🏓
app.get("/ping", (req, res) => {
  res.status(200).json("pong")
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
