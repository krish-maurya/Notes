import React, { useEffect } from "react";
import {CheckCircle} from "lucide-react";
export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div>
      <div
        className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg text-white 
      ${type === "success" ? "bg-green-500" : "bg-red-500"}
    `}
      >
        {type === "success" ? <CheckCircle className="inline mr-2" /> : null}
        {message}
      </div>
    </div>
  );
}
