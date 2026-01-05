// ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { emailOrPhone: value }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="box-border  items-center  w-1/2  bg-green-200 justify-center border-4 p-5 m-20  flex flex-col  " >
      <h2 className=" p-2 ">Forgot Password</h2>

      <form className=" flex  flex-col items-center justify-center" onSubmit={handleSubmit}>
        <input className="  bg-white border-2"
          type="text"
          placeholder="Email or Phone"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <button className=" m-2 bg-indigo-500  p-2 text-white rounded-sm" type="submit">Reset Password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
