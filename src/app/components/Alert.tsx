"use client";

import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Alert = {
  Container: () => <ToastContainer />,

  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options,
      style: {
        background: '#10B981',
        color: 'white',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        ...options?.style,
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options,
      style: {
        background: '#EF4444',
        color: 'white',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        ...options?.style,
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options,
      style: {
        background: '#3B82F6',
        color: 'white',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        ...options?.style,
      },
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options,
      style: {
        background: '#F59E0B',
        color: 'white',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        ...options?.style,
      },
    });
  }
};
