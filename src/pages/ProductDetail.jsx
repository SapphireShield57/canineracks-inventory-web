import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/inventory/products/${id}/`, authHeaders)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));

    axios
      .get(`http://localhost:8000/api/inventory/products/${id}/history/`, authHeaders)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Error fetching history:", err));
  }, [id]);

  const handleEdit = () => navigate(`/product/${id}/edit`);
  const handleBack = () => navigate("/dashboard");

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/inventory/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.status === 204) {
        toast.success("✅ Product deleted successfully!");
        navigate("/dashboard");
      } else {
        toast.error("⚠️ Unexpected delete response.");
        console.log("Delete response:", res);
      }
    } catch (error) {
      console.error("❌ Delete failed:", error.response?.data || error.message);
      toast.error("❌ Failed to delete product.");
    }
  };
  
  

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 to-white p-10 flex flex-col md:flex-row items-start gap-8">
      {/* Product Detail Panel */}
      <div className="bg-gray-300 p-6 rounded-xl w-full md:w-1/2 shadow-md">
        <h1 className="text-4xl font-semibold text-center mb-6">Product Details</h1>

        <div className="bg-white p-3 mb-4">
          <h2 className="text-xl font-semibold">Name</h2>
          <p>{product.name}</p>
        </div>

        <div className="bg-white p-3 mb-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <ul className="list-disc ml-6">
            {product.description.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>

        <p className="text-lg text-black mb-2">
          <strong>Quantity:</strong> {product.quantity}
        </p>
        <p className="text-lg text-black mb-2">
          <strong>Product Code:</strong> {product.product_code}
        </p>
        <p className="text-lg text-black mb-2">
          <strong>Selling Price:</strong> ₱{parseFloat(product.selling_price).toFixed(2)}
        </p>
        <p className="text-lg text-black mb-2">
          <strong>Purchased Price:</strong> ₱{parseFloat(product.purchased_price).toFixed(2)}
        </p>
        <p className="text-lg text-black mb-6">
          <strong>Supplier:</strong> {product.supplier_name}
        </p>

        <div className="flex justify-between gap-4">
          <button onClick={handleEdit} className="bg-cyan-400 px-6 py-2 rounded text-white">
            Edit
          </button>
          <button onClick={handleDelete} className="bg-red-500 px-6 py-2 rounded text-white">
            Delete
          </button>
          <button onClick={handleBack} className="bg-gray-700 px-6 py-2 rounded text-white">
            Back
          </button>
        </div>
      </div>

      {/* Transaction History Panel */}
      <div className="bg-white p-6 rounded-xl w-full md:w-1/2 flex flex-col items-center shadow-md">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48 object-contain mb-4 border rounded shadow"
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center bg-gray-100 border rounded mb-4 text-gray-500 text-sm">
            No image available
          </div>
        )}

        <h2 className="text-3xl font-bold text-center mb-4">Transaction History</h2>
        {history.length === 0 ? (
          <p className="text-gray-600">No history yet.</p>
        ) : (
          <table className="w-full text-left text-black">
            <thead>
              <tr className="border-b">
                <th className="py-2 font-semibold">Type</th>
                <th className="py-2 font-semibold">Qty</th>
                <th className="py-2 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id} className="border-b text-sm">
                  <td className="py-1">{entry.action}</td>
                  <td className="py-1">{entry.quantity_changed}</td>
                  <td className="py-1">{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
