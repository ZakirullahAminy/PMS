const mongoose = require('mongoose');
const Card = require('./models/Card');

mongoose.connect('mongodb://localhost:27017/Cards', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyCards = [
  {
    title: "Learn React Basics",
    imageUrl: "https://via.placeholder.com/300x200.png?text=React+Card",
    downloadUrl: "https://example.com/react-guide.pdf",
    readUrl: "https://example.com/react-guide-online",
  },
  {
    title: "Node.js API Design",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Node.js+Card",
    downloadUrl: "https://example.com/node-api.pdf",
    readUrl: "https://example.com/node-api-online",
  },
  {
    title: "MongoDB Cheatsheet",
    imageUrl: "https://via.placeholder.com/300x200.png?text=MongoDB+Card",
    downloadUrl: "https://example.com/mongodb-cheatsheet.pdf",
    readUrl: "https://example.com/mongodb-cheatsheet-online",
  },
];

Card.insertMany(dummyCards)
  .then(() => {
    console.log('Dummy cards inserted!');
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
