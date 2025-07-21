import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MAX_CAPACITY = 2000;

const mainCategories = {
  Food: ['Dry', 'Wet', 'Raw'],
  Treat: ['Dental', 'Training'],
  Health: ['Vitamins', 'Tick & Flea / Parasite Prevention', 'Recovery Collars'],
  Grooming: ['Shampoo & Conditioners', 'Pet Brush', 'Spritz & Wipes'],
  Wellness: ['Toys', 'Beds & Kennels', 'Harness & Leashes'],
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    product_code: '',
    selling_price: '',
    purchased_price: '',
    supplier_name: '',
    main_category: '',
    sub_category: '',
    date_purchased: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      name, description, quantity, product_code,
      selling_price, purchased_price, supplier_name,
      main_category, sub_category, image, date_purchased,
    } = form;

    if (
      !name.trim() || !description.trim() || !quantity || !product_code.trim() ||
      !selling_price || !purchased_price || !supplier_name.trim() ||
      !main_category || !sub_category || !date_purchased || !image
    ) {
      setError('Please fill in all required fields including image.');
      return;
    }

    if (parseInt(quantity) > MAX_CAPACITY) {
      alert(`Cannot add product. Inventory max capacity is ${MAX_CAPACITY}.`);
      return;
    }

    if (parseFloat(selling_price) <= 0 || parseFloat(purchased_price) <= 0) {
      setError('Prices must be greater than 0.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setLoading(true);
      await axios.post('https://canineracks-backend.onrender.com/api/inventory/products/', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      toast.success('Product added successfully!', { position: 'top-center' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to save product. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-xl flex flex-col md:flex-row gap-8"
      >
        <div className="md:w-2/3 space-y-4">
          <h2 className="text-3xl font-bold text-center">Add Product</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Form Fields */}
          {/* Same as before — no structural changes needed — unchanged blocks omitted for brevity */}

          <div>
            <label className="block font-medium">Upload Product Image <span className="text-red-500">*</span></label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
            {form.image && <p className="text-sm mt-1 text-gray-600">Selected: {form.image.name}</p>}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className={`px-6 py-3 rounded text-white ${loading ? 'bg-gray-500' : 'bg-cyan-600 hover:bg-cyan-700'}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700">
              Back
            </button>
          </div>
        </div>

        <div className="md:w-1/3 flex items-center justify-center">
          <div className="w-full h-64 border rounded flex items-center justify-center bg-gray-50">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
            ) : (
              <span className="text-gray-500">Image preview</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
