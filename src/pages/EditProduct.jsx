import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(`https://canineracks-backend.onrender.com/api/inventory/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProduct(res.data);
        setImagePreview(res.data.image);
      })
      .catch(() => setError("Failed to load product."));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const requiredFields = [
      'name', 'description', 'product_code', 'quantity',
      'selling_price', 'purchased_price', 'supplier_name',
      'main_category', 'sub_category'
    ];

    for (let field of requiredFields) {
      if (!product[field] || product[field].toString().trim() === '') {
        return toast.error(`Please fill out the ${field.replace('_', ' ')} field.`);
      }
    }

    if (product.quantity < 0 || product.selling_price < 0 || product.purchased_price < 0) {
      return toast.error('Quantity and prices must not be negative.');
    }

    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.get('https://canineracks-backend.onrender.com/api/inventory/products/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const total = res.data.reduce((sum, p) => sum + (p.id === product.id ? 0 : p.quantity), 0);
      if (total + parseInt(product.quantity) > 2000) {
        return toast.error('Cannot save: Total inventory exceeds 2000 units.');
      }
    } catch {
      return toast.error('Failed to validate stock capacity.');
    }

    const formData = new FormData();
    for (let key in product) {
      if (key !== 'image') formData.append(key, product[key]);
    }
    if (newImage) formData.append('image', newImage);

    try {
      await axios.put(
        `https://canineracks-backend.onrender.com/api/inventory/products/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success('Product updated successfully!');
      navigate(`/product/${id}`);
    } catch {
      toast.error('Failed to update product.');
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 to-white p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-6xl flex flex-col md:flex-row gap-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleImageDrop}
      >
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-center mb-4">Edit Product Details</h2>

          <div>
            <label className="block text-xl font-bold">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-3 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-xl font-bold">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-3 border rounded mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">Quantity <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Product Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="product_code"
                value={product.product_code}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Selling Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="selling_price"
                value={product.selling_price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Purchased Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="purchased_price"
                value={product.purchased_price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block">Supplier Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="supplier_name"
                value={product.supplier_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Main Category <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="main_category"
                value={product.main_category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Sub Category <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="sub_category"
                value={product.sub_category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="pt-4">
            <label className="block font-semibold">Upload Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-cyan-400 text-white px-4 py-2 rounded hover:bg-cyan-500"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => navigate(`/product/${id}`)}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <h3 className="text-2xl font-semibold mb-4">Current Image</h3>
          <div className="w-64 h-64 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
