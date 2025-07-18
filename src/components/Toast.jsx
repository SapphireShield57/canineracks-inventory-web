// src/components/Toast.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
  return <ToastContainer position="top-center" autoClose={2500} />;
}
