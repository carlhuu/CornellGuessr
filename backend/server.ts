import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const guesses: { userId: string; lat: number; lng: number; timestamp: number }[] = [];

// GET: Fetch all guesses
app.get("/api/guesses", (req, res) => {
  res.status(200).json({ guesses });
});

// POST: Submit a guess
app.post("/api/guesses", (req, res) => {
  const { lat, lng, userId } = req.body;
  if (!lat || !lng || !userId) {
    return res.status(400).json({ message: "Invalid guess data." });
  }
  const guess = { lat, lng, userId, timestamp: Date.now() };
  guesses.push(guess);
  res.status(201).json({ message: "Guess saved!", guess });
});

// PUT: Update the latest guess of a user
app.put("/api/guesses/:userId", (req, res) => {
  const { userId } = req.params;
  const { lat, lng } = req.body;
  const index = guesses.findIndex((g) => g.userId === userId);
  if (index === -1) {
    return res.status(404).json({ message: "Guess not found." });
  }
  guesses[index] = { ...guesses[index], lat, lng, timestamp: Date.now() };
  res.status(200).json({ message: "Guess updated.", guess: guesses[index] });
});

// DELETE: Remove all guesses of a user
app.delete("/api/guesses/:userId", (req, res) => {
  const { userId } = req.params;
  const initialLength = guesses.length;
  const filteredGuesses = guesses.filter((g) => g.userId !== userId);
  if (filteredGuesses.length === initialLength) {
    return res.status(404).json({ message: "No guesses found for user." });
  }
  guesses.length = 0;
  guesses.push(...filteredGuesses);
  res.status(200).json({ message: "Guesses deleted for user." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
