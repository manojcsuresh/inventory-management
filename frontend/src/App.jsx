import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", category: "", price: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: "", price: "", category: "" });


  const fetchItems = async () => {
    const res = await axios.get(API_URL);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.name && form.quantity) {
      await axios.post(API_URL, form);
      setForm({ name: "", quantity: "", category: "", price: "" });
      fetchItems();
    }
  };

  const deleteItem = async (id) => {
  await axios.put(`${API_URL}/decrease/${id}`);
  fetchItems();
};

const startEditing = (item) => {
  setEditingItem(item._id);
  setEditForm({ quantity: item.quantity, price: item.price, category: item.category });
};

const cancelEditing = () => {
  setEditingItem(null);
};

const handleEditChange = (e) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const submitEdit = async (id) => {
  await axios.put(`${API_URL}/${id}`, editForm);
  setEditingItem(null);
  fetchItems();
};


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">📦 Inventory Tracker</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            className="p-2 border border-gray-300 rounded"
            name="name"
            placeholder="Item Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="p-2 border border-gray-300 rounded"
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
          />
          <input
            className="p-2 border border-gray-300 rounded"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <input
            className="p-2 border border-gray-300 rounded"
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          onClick={handleSubmit}
        >
          ➕ Add Item
        </button>

       <ul className="mt-6 space-y-3">
  {items.map((item) => (
  <li key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded shadow">
    <div className="flex-1">
      <p className="font-semibold">
        {item.name} {item.quantity > 0 ? `(${item.quantity})` : ""}
      </p>
      <p className={`text-sm ${item.quantity === 0 ? "text-red-500 font-semibold" : "text-gray-500"}`}>
        {item.quantity === 0 ? "Out of Stock" : `${item.category} — ₹${item.price}`}
      </p>
    </div>

    {editingItem === item._id ? (
      <div className="space-x-2">
        <input
          type="number"
          name="quantity"
          className="w-16 px-1 py-0.5 border rounded"
          value={editForm.quantity}
          onChange={handleEditChange}
        />
        <input
          type="number"
          name="price"
          className="w-20 px-1 py-0.5 border rounded"
          value={editForm.price}
          onChange={handleEditChange}
        />
        <input
          type="text"
          name="category"
          className="w-24 px-1 py-0.5 border rounded"
          value={editForm.category}
          onChange={handleEditChange}
        />
        <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => submitEdit(item._id)}>
          ✔️
        </button>
        <button className="bg-gray-300 px-2 py-1 rounded" onClick={cancelEditing}>
          ❌
        </button>
      </div>
    ) : (
      <div className="space-x-2">
        <button
          className={`px-2 py-1 rounded ${
            item.quantity > 0 ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-500"
          }`}
          onClick={() => deleteItem(item._id)}
          disabled={item.quantity === 0}
        >
          ➖
        </button>
        <button className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => startEditing(item)}>
          ✏️
        </button>
      </div>
    )}
  </li>
))}

</ul>
      </div>
    </div>
  );
}

export default App;
