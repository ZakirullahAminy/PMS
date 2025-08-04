import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Product({ user }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  const isAdmin = user.role === "admin";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    const url = new URL("http://localhost:5000/api/products");
    if (selectedCategory) url.searchParams.append("category", selectedCategory);
    if (searchQuery) url.searchParams.append("search", searchQuery);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", 9);

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      });
  }, [selectedCategory, searchQuery, page]);

  const refreshCategories = async () => {
    const res = await fetch("http://localhost:5000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        price: "",
        category: "",
      });
      setEditingId(null);
      setPage(1);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    setProducts((prev) => prev.filter((p) => p._id !== id));
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

    const method = editingCategoryId ? "PUT" : "POST";
    const endpoint = editingCategoryId
      ? `http://localhost:5000/api/categories/${editingCategoryId}`
      : "http://localhost:5000/api/categories";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });

    if (res.ok) {
      await refreshCategories();
      setNewCategory("");
      setEditingCategoryId(null);
    }
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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with AOS animation */}
      <div
        data-aos="fade-down"
        data-aos-duration="500"
        className="flex justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, <span className="text-blue-600">{user.username}</span>
          <span className="text-xs ml-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">
            {user.role}
          </span>
        </h2>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-all hover:gap-2"
        >
          Logout <span className="text-lg">→</span>
        </button>
      </div>

      {isAdmin && (
        <div className="space-y-8">
          {/* Category Section */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-blue-100 transition-all"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              {editingCategoryId ? (
                <span className="text-yellow-500">✏️</span>
              ) : (
                <span className="text-green-500">➕</span>
              )}
              {editingCategoryId ? "Edit Category" : "Add New Category"}
            </h1>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <input
                required
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="border-2 border-gray-200 p-3 w-full rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:from-green-600 hover:to-green-700"
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
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:shadow-md transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Category List */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-blue-500">📦</span> All Categories
            </h2>
            <ul className="divide-y divide-gray-200">
              {categories.map((cat, index) => (
                <li
                  key={cat._id}
                  data-aos="fade-right"
                  data-aos-delay={300 + index * 50}
                  className="py-4 flex items-center justify-between hover:bg-gray-50 px-3 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNewCategory(cat.name);
                        setEditingCategoryId(cat._id);
                      }}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-sm hover:shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-sm hover:shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Form */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              {editingId ? (
                <span className="text-yellow-500">✏️</span>
              ) : (
                <span className="text-blue-500">➕</span>
              )}
              {editingId ? "Edit Product" : "Add Product"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Name"
                className="border-2 border-gray-200 p-3 w-full rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all"
              />
              <input
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                className="border-2 border-gray-200 p-3 w-full rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all"
              />
              <input
                required
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="Image URL"
                className="border-2 border-gray-200 p-3 w-full rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all"
              />
              <input
                required
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Price"
                className="border-2 border-gray-200 p-3 w-full rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all"
              />
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="border-2 border-gray-200 p-3 w-full rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
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
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:shadow-md transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div
        data-aos="fade-up"
        className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-purple-500">🔍</span> Filter Products
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all w-full md:w-64"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            required
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all w-full"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map((prod, index) => (
            <div
              key={prod._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-blue-200 hover:-translate-y-1"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  {prod.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {prod.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-blue-600 font-bold text-lg">
                    ${prod.price}
                  </p>
                  <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {prod.category?.name}
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 transition-all flex items-center gap-1 hover:gap-2"
          >
            ← <span>Prev</span>
          </button>
          <span className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 transition-all flex items-center gap-1 hover:gap-2"
          >
            <span>Next</span> →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
