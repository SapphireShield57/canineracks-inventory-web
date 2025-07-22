import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MAX_CAPACITY = 2000;

const mainCategories = {
  Food: ['Dry', 'Wet', 'Raw'],
  Treat: ['Dental', 'Training'],
  Health: ['Vitamins', 'Tick & Flea / Parasite Prevention', 'Recovery Collars'],
  Grooming: ['Shampoo & Conditioner', 'Pet Brush', 'Spritz & Wipes'],
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
      !name || !description || !quantity || !product_code ||
      !selling_price || !purchased_price || !supplier_name ||
      !main_category || !sub_category || !date_purchased || !image
    ) {
      setError('Please fill in all required fields including image.');
      return;
    }

    if (parseInt(quantity) > MAX_CAPACITY) {
      alert(`Cannot add product. Inventory max capacity is ${MAX_CAPACITY}.`);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post('https://canineracks-backend.onrender.com/api/inventory/products/', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      toast.success('Product added successfully!', { position: 'top-center' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to save product. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        encType="multipart/form-data" // ✅ Required for file uploads
        className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-xl flex flex-col md:flex-row gap-8"
      >
        <div className="md:w-2/3 space-y-4">
          <h2 className="text-3xl font-bold text-center">Add Product</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block font-medium">Name <span className="text-red-500">*</span></label>
            <input name="name" type="text" className="w-full p-3 border rounded" onChange={handleChange} />
          </div>

          <div>
            <label className="block font-medium">Description <span className="text-red-500">*</span></label>
            <textarea name="description" rows="3" className="w-full p-3 border rounded" onChange={handleChange}></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Quantity <span className="text-red-500">*</span></label>
              <input name="quantity" type="number" className="w-full p-3 border rounded" onChange={handleChange} />
            </div>
            <div>
              <label className="block font-medium">Product Code <span className="text-red-500">*</span></label>
              <input name="product_code" type="text" className="w-full p-3 border rounded" onChange={handleChange} />
            </div>
            <div>
              <label className="block font-medium">Selling Price (₱) <span className="text-red-500">*</span></label>
              <input name="selling_price" type="number" className="w-full p-3 border rounded" onChange={handleChange} />
            </div>
            <div>
              <label className="block font-medium">Purchased Price (₱) <span className="text-red-500">*</span></label>
              <input name="purchased_price" type="number" className="w-full p-3 border rounded" onChange={handleChange} />
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Supplier <span className="text-red-500">*</span></label>
              <input name="supplier_name" type="text" className="w-full p-3 border rounded" onChange={handleChange} />
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Date Purchased <span className="text-red-500">*</span></label>
              <input type="date" name="date_purchased" className="w-full p-3 border rounded" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block font-medium">Main Category <span className="text-red-500">*</span></label>
            <select name="main_category" className="w-full p-3 border rounded" onChange={handleChange}>
              <option value="">Select Main Category</option>
              {Object.keys(mainCategories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {form.main_category && (
            <div>
              <label className="block font-medium">Sub Category <span className="text-red-500">*</span></label>
              <select name="sub_category" className="w-full p-3 border rounded" onChange={handleChange}>
                <option value="">Select Sub Category</option>
                {mainCategories[form.main_category].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium">Upload Product Image <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Drag and drop also supported.</p>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="submit" className="bg-cyan-600 text-white px-6 py-3 rounded hover:bg-cyan-700">Save</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700">Back</button>
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
