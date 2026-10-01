import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({ label = "password", ...props }) {
  const [visible, setVisible] = useState(false);
  const action = `${visible ? "Hide" : "Show"} ${label}`;

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        placeholder="••••••••"
        className={`w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm ${visible ? "tracking-normal" : "tracking-widest"}`}
      />
      <button
        type="button"
        aria-label={action}
        aria-pressed={visible}
        aria-controls={props.id}
        title={action}
        onClick={() => setVisible(current => !current)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-gray-400 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
      >
        {visible ? <FiEye size={18} aria-hidden="true" /> : <FiEyeOff size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
