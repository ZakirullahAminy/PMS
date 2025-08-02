import { useState, useEffect } from "react";

function Card() {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [readUrl, setReadUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageUrl || !downloadUrl || !readUrl || !description) {
      return alert("Please fill all fields");
    }

    const res = await fetch("http://localhost:5000/api/add/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        imageUrl,
        downloadUrl,
        readUrl,
        description,
      }),
    });

    if (res.ok) {
      const newCard = await res.json();
      setCards((prev) => [...prev, newCard]);
      setTitle("");
      setImageUrl("");
      setDownloadUrl("");
      setReadUrl("");
      setDescription("");
    } else {
      alert("Failed to add card");
    }
  };

  return (
    <div className=" px-6 lg:px-12 py-7">
      <h1 className="text-2xl font-bold mb-4">Add a Card</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full p-2 border rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Download URL"
          className="w-full p-2 border rounded"
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Read URL"
          className="w-full p-2 border rounded"
          value={readUrl}
          onChange={(e) => setReadUrl(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Card
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.length === 0 && <p>No cards yet.</p>}
        {cards.map((card) => (
          <div
            key={card._id}
            className="border p-4 rounded shadow flex flex-col items-start   gap-4"
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-52 object-cover rounded"
            />
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">{card.title}</h3>
              <p>{card.description}</p>
              <div className="flex gap-3">
                <a
                  href={card.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                  Download
                </a>
                <a
                  href={card.readUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                >
                  Read Online
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/Cards", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const cardSchema = new mongoose.Schema({
//   title: String,
//   imageUrl: String,
//   downloadUrl: String,
//   readUrl: String,
//   description: String,
// });

// const Card = mongoose.model("Card", cardSchema);

// // Add card route
// app.post("/api/add/card", async (req, res) => {
//   try {
//     const { title, imageUrl, downloadUrl, readUrl, description } = req.body;
//     const card = new Card({
//       title,
//       imageUrl,
//       downloadUrl,
//       readUrl,
//       description,
//     });
//     await card.save();
//     res.status(201).json(card);
//   } catch (error) {
//     res.status(500).json({ message: "Error adding card" });
//   }
// });

// // Get cards route
// app.get("/api/cards", async (req, res) => {
//   try {
//     const cards = await Card.find();
//     res.json(cards);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching cards" });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });