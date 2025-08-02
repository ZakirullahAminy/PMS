const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb://localhost:27017/dataBase"
    // "mongodb+srv://hajiaminy8:zaFgIlgeNo8I0M9y@cluster0.fc7rr1k.mongodb.net/mongoosdb3"
  );
};
module.exports = connectDB();
