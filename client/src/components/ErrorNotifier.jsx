/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ErrorNotifier = ({ message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-5 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default ErrorNotifier;
