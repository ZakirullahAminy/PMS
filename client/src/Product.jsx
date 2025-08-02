import { useEffect, useState } from "react";

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then(setProducts);

    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const refreshCategories = async () => {
    const res = await fetch("http://localhost:5000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const res = await fetch(
        `http://localhost:5000/api/products/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        const updatedProd = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? updatedProd : p))
        );
        setEditingId(null);
      }
    } else {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newProd = await res.json();
        setProducts((prev) => [...prev, newProd]);
      }
    }

    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      price: "",
      category: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleEdit = (prod) => {
    setFormData({
      name: prod.name,
      description: prod.description,
      imageUrl: prod.imageUrl,
      price: prod.price,
      category: prod.category?._id || "",
    });
    setEditingId(prod._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    if (editingCategoryId) {
      // Edit existing category
      const res = await fetch(
        `http://localhost:5000/api/categories/${editingCategoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        }
      );
      if (res.ok) {
        await refreshCategories();
        setNewCategory("");
        setEditingCategoryId(null);
      }
    } else {
      // Create new category
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (res.ok) {
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
        setNewCategory("");
      }
    }
  };

  const handleEditCategory = (cat) => {
    setNewCategory(cat.name);
    setEditingCategoryId(cat._id);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      await refreshCategories();
    } else {
      alert(data.message || "Could not delete category");
    }
  };

  return (
    <div className="p-6">
       <h2 className="text-lg font-bold mb-2">PMS</h2>
      <div className="my-6">
        <h1 className="text-xl font-bold">
          {editingCategoryId ? "Edit Category" : "Add New Category"}
        </h1>
        <form
          onSubmit={handleAddCategory}
          className="flex flex-col gap-2 items-start mt-2"
        >
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="border p-2 w-full"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editingCategoryId ? "Update" : "Add"}
            </button>
            {editingCategoryId && (
              <button
                type="button"
                onClick={() => {
                  setNewCategory("");
                  setEditingCategoryId(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category List with Edit/Delete */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">All Categories</h2>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat._id} className="flex items-center justify-between">
              <span>{cat.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(cat)}
                  className="text-sm bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add and edit Product */}
      <h1 className="text-xl font-bold">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
          className="border p-2 w-full"
        />
        <input
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          placeholder="Image URL"
          className="border p-2 w-full"
        />
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          placeholder="Price"
          className="border p-2 w-full"
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="border p-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  description: "",
                  imageUrl: "",
                  price: "",
                  category: "",
                });
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filter and Search */}
      <div className="mt-6">
        <h1 className="text-xl font-bold my-6">Filter by Category</h1>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 w-52"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full md:w-1/2"
          />
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {products
            .filter(
              (p) =>
                (!selectedCategory || p.category?._id === selectedCategory) &&
                (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
            )
            .map((prod) => (
              <div key={prod._id} className="border p-4 rounded shadow">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="h-40 w-full object-cover mb-2"
                />
                <h3 className="font-bold">{prod.name}</h3>
                <p>{prod.description}</p>
                <p className="text-sm text-gray-600">${prod.price}</p>
                <p className="text-xs text-gray-400">{prod.category?.name}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
