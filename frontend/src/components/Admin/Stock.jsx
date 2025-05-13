import React, { useState, useEffect } from "react";

const Stock = () => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [form, setForm] = useState({
    id: null,
    name: "",
    stock: "",
    sold: "",
    date: "",
    revenue: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.stock || !form.sold || !form.date || !form.revenue) {
      alert("Please fill in all fields!");
      return;
    }

    if (isEditing) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === form.id
            ? { ...form, stock: parseInt(form.stock), sold: parseInt(form.sold), revenue: parseFloat(form.revenue) }
            : product
        )
      );
      setIsEditing(false);
    } else {
      const newProduct = {
        id: products.length + 1,
        name: form.name,
        stock: parseInt(form.stock),
        sold: parseInt(form.sold),
        date: form.date,
        revenue: parseFloat(form.revenue),
      };
      setProducts([...products, newProduct]);
    }

    setForm({ id: null, name: "", stock: "", sold: "", date: "", revenue: "" });
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      stock: product.stock.toString(),
      sold: product.sold.toString(),
      date: product.date,
      revenue: product.revenue.toString(),
    });
    setIsEditing(true);
  };

  const renderCircularGraph = (value, max, color) => {
    const normalizedValue = (value / max) * 100; // Normalize to a percentage
    const percentage = Math.min(normalizedValue, 100); // Cap at 100%
    
    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="none"
            r="36"
            cx="50%"
            cy="50%"
          />
          <circle
            className={`text-${color}-500`}
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            r="36"
            cx="50%"
            cy="50%"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {normalizedValue.toFixed(1)}% {/* Display normalized percentage */}
        </div>
      </div>
    );
  };
  

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Stock Management</h2>

      {/* Product Table */}
      {products.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Product Name</th>
              <th className="border border-gray-300 p-2">Stock</th>
              <th className="border border-gray-300 p-2">Sold Out</th>
              <th className="border border-gray-300 p-2">Current Stock</th>
              <th className="border border-gray-300 p-2">Date Purchased</th>
              <th className="border border-gray-300 p-2">Revenue Earned</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.stock}</td>
                <td className="border border-gray-300 p-2">{product.sold}</td>
                <td className="border border-gray-300 p-2">
                  {product.stock - product.sold}
                </td>
                <td className="border border-gray-300 p-2">{product.date}</td>
                <td className="border border-gray-300 p-2">${product.revenue}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mb-6">No products added yet.</p>
      )}

      {/* Product Entry Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Total Stock"
            value={form.stock}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="sold"
            placeholder="Sold Out"
            value={form.sold}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="revenue"
            placeholder="Revenue Earned"
            value={form.revenue}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`mt-4 px-4 py-1 text-sm rounded text-white ${
            isEditing ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Circular Graphical Representation */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Inventory Overview (Circular Charts)</h3>
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="text-center">
              <h4 className="font-semibold mb-2">{product.name}</h4>
              <div className="flex justify-around">
                {renderCircularGraph(product.stock, 100, "teal")}
                {renderCircularGraph(product.sold, 100, "orange")}
                {renderCircularGraph(product.revenue, 500, "purple")}
              </div>
              <div className="flex justify-around mt-2 text-sm">
                <span className="text-teal-600">Stock</span>
                <span className="text-orange-600">Sold</span>
                <span className="text-purple-600">Revenue</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stock;
