import { useState } from "react";
import api from "../api/axios";

function ForgotPassword() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/auth/forgot-password", {
        emailOrPhone: value
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "70px auto" }}>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email or Phone"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Reset Password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
