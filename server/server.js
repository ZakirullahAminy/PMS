// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/ProductCategory");

// // Schemas
// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
// });

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   imageUrl: String,
//   price: Number,
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
// });

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "user"], default: "user" },
// });

// const Category = mongoose.model("Category", categorySchema);
// const Product = mongoose.model("Product", productSchema);
// const User = mongoose.model("User", userSchema);

// // User Login/Register
// app.post("/api/login", async (req, res) => {
//   const { username, password, role } = req.body;
//   try {
//     let user = await User.findOne({ username });

//     if (!user) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       user = new User({ username, password: hashedPassword, role });
//       await user.save();
//       return res.status(201).json({ username: user.username, role: user.role });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Incorrect password" });

//     res.json({ username: user.username, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: "Login error" });
//   }
// });

// // CRUD for categories and products (same as your original code)
// app.post("/api/categories", async (req, res) => {
//   try {
//     const category = new Category(req.body);
//     await category.save();
//     res.status(201).json(category);
//   } catch (error) {
//     res.status(500).json({ message: "Error adding category" });
//   }
// });

// app.put("/api/categories/:id", async (req, res) => {
//   try {
//     const updated = await Category.findByIdAndUpdate(
//       req.params.id,
//       { name: req.body.name },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating category" });
//   }
// });

// app.get("/api/categories", async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching categories" });
//   }
// });

// app.delete("/api/categories/:id", async (req, res) => {
//   try {
//     const products = await Product.find({ category: req.params.id });
//     if (products.length > 0) {
//       return res.status(400).json({ message: "Category has products" });
//     }
//     await Category.findByIdAndDelete(req.params.id);
//     res.json({ message: "Category deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting category" });
//   }
// });

// app.post("/api/products", async (req, res) => {
//   const { category } = req.body;
//   if (!category || !mongoose.Types.ObjectId.isValid(category)) {
//     return res.status(400).json({ message: "Invalid category ID" });
//   }

//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Error adding product" });
//   }
// });

// app.get("/api/products", async (req, res) => {
//   try {
//     const { category, search, page = 1, limit = 9 } = req.query;

//     const query = {};
//     if (category) query.category = category;
//     if (search) {
//       const regex = new RegExp(search, "i");
//       query.$or = [{ name: regex }, { description: regex }];
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const total = await Product.countDocuments(query);
//     const products = await Product.find(query)
//       .populate("category")
//       .skip(skip)
//       .limit(parseInt(limit));

//     res.json({
//       products,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching products" });
//   }
// });

// app.put("/api/products/:id", async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating product" });
//   }
// });

// app.delete("/api/products/:id", async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting product" });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ProductCategory");

// Schemas
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);

// Login/Register with strict admin check
app.post("/api/login", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      if (role === "admin" && password !== "12345") {
        return res.status(403).json({ message: "Invalid admin credentials" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, password: hashedPassword, role });
      await user.save();
      return res.status(201).json({ username: user.username, role: user.role });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (user.role === "admin" && password !== "12345") {
      return res.status(403).json({ message: "Invalid admin credentials" });
    }

    res.json({ username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// Category Routes
app.post("/api/categories", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error adding category" });
  }
});

app.put("/api/categories/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id });
    if (products.length > 0) {
      return res.status(400).json({ message: "Category has products" });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
});

// Product Routes
app.post("/api/products", async (req, res) => {
  const { category } = req.body;
  if (!category || !mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { description: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category")
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
