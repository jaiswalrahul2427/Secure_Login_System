import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openForgotPassword = () => {
    window.open("/forgot-password", "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message);

      // Redirect to forgot password after profile creation
      setTimeout(() => {
        navigate("/forgot-password");
      }, 1500);

    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "70px auto" }}>
      <h2>Create Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Create Profile</button>
      </form>

      {message && <p>{message}</p>}

      <br />
      <button link="/forgot-password" onClick={openForgotPassword}>
        Forgot Password
      </button>
    </div>
  );
}

export default Profile;
