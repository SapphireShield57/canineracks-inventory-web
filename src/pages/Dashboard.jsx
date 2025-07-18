import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [editedQuantities, setEditedQuantities] = useState({});

  const navigate = useNavigate();
  const maxCapacity = 2000;

  const subCategoryMap = {
    Food: ["Dry", "Wet", "Raw"],
    Treat: ["Dental", "Training"],
    Health: ["Vitamins", "Tick & Flea / Parasite Prevention", "Recovery Collars"],
    Grooming: ["Shampoo & Conditioners", "Pet Brush", "Spritz & Wipes"],
    Wellness: ["Toys", "Beds & Kennels", "Harness & Leashes"],
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("https://canineracks-backend.onrender.com/api/inventory/products/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProducts(response.data))
      .catch((error) => {
        console.error("Error fetching products:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity)) {
      setEditedQuantities((prev) => ({
        ...prev,
        [id]: quantity,
      }));
    }
  };

  const handleConfirmQuantities = () => {
    const total = products.reduce((sum, product) => {
      const newQty = editedQuantities[product.id];
      return sum + (newQty !== undefined ? newQty : product.quantity);
    }, 0);

    if (total > maxCapacity) {
      toast.error("🚫 Total stock exceeds max capacity of 2000. Please adjust quantities.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    const updates = Object.entries(editedQuantities).map(([id, quantity]) => {
      return axios.patch(
        `https://canineracks-backend.onrender.com/api/inventory/products/${id}/`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });

    Promise.all(updates)
      .then(() => {
        toast.success("✅ Quantities updated successfully.");
        setTimeout(() => window.location.reload(), 1500);
      })
      .catch(() => toast.error("❌ Failed to update quantities."));
  };

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const mainMatch = !selectedMainCategory || product.main_category === selectedMainCategory;
    const subMatch = !selectedSubCategory || product.sub_category === selectedSubCategory;
    return nameMatch && mainMatch && subMatch;
  });

  const totalStock = products.reduce(
    (sum, product) => sum + (editedQuantities[product.id] ?? product.quantity),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">CanineRacks 🐾 Dashboard</h1>
        <div className="text-lg font-medium">Total Stocks: {totalStock} / 2000</div>
        <div className="space-x-2">
          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
            onClick={() => navigate("/add-product")}
          >
            Add Product
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedMainCategory}
          onChange={(e) => {
            setSelectedMainCategory(e.target.value);
            setSelectedSubCategory("");
          }}
          className="p-2 border rounded"
        >
          <option value="">All Main Categories</option>
          {Object.keys(subCategoryMap).map((mainCat) => (
            <option key={mainCat} value={mainCat}>
              {mainCat}
            </option>
          ))}
        </select>
        <select
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          disabled={!selectedMainCategory}
          className="p-2 border rounded"
        >
          <option value="">All Sub Categories</option>
          {selectedMainCategory &&
            subCategoryMap[selectedMainCategory].map((subCat) => (
              <option key={subCat} value={subCat}>
                {subCat}
              </option>
            ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-left px-4 py-2">Quantity</th>
              <th className="text-left px-4 py-2">Product Code</th>
              <th className="text-left px-4 py-2">Selling Price</th>
              <th className="text-left px-4 py-2">Purchased Price</th>
              <th className="text-left px-4 py-2">Gain</th>
              <th className="text-left px-4 py-2">Supplier</th>
              <th className="text-left px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-100">
                <td className="text-black px-4 py-2">{product.name}</td>
                <td className="text-black px-4 py-2">{product.description}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    className="w-20 px-2 py-1 border rounded"
                    value={editedQuantities[product.id] ?? product.quantity}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  />
                </td>
                <td className="text-black px-4 py-2">{product.product_code}</td>
                <td className="text-black px-4 py-2">₱{product.selling_price}</td>
                <td className="text-black px-4 py-2">₱{product.purchased_price}</td>
                <td className="text-black px-4 py-2">
                  ₱{(parseFloat(product.selling_price) - parseFloat(product.purchased_price)).toFixed(2)}
                </td>
                <td className="text-black px-4 py-2">{product.supplier_name}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {Object.keys(editedQuantities).length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleConfirmQuantities}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirm Quantity Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
