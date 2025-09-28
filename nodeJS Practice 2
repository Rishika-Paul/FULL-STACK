import express from "express";

const app = express();
app.use(express.json());

// In-memory collection of playing cards
let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Spades", value: "King" },
  { id: 3, suit: "Diamonds", value: "Queen" },
];

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Playing Card Collection API!");
});

// GET all cards
app.get("/cards", (req, res) => {
  res.status(200).json({
    success: true,
    message: "All cards retrieved successfully",
    cards: cards,
  });
});

// POST a new card
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res.status(400).json({
      success: false,
      message: "Suit and value are required",
    });
  }

  const newCard = {
    id: Date.now(), // unique ID
    suit,
    value,
  };

  cards.push(newCard);

  res.status(201).json({
    success: true,
    message: "Card added successfully",
    card: newCard,
    cards: cards,
  });
});

// GET a card by ID
app.get("/cards/:id", (req, res) => {
  const id = Number(req.params.id);
  const card = cards.find((c) => c.id === id);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Card not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Card retrieved successfully",
    card: card,
  });
});

// DELETE a card by ID
app.delete("/cards/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cards.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Card not found",
    });
  }

  const deletedCard = cards.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Card deleted successfully",
    deletedCard: deletedCard[0],
    cards: cards,
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
