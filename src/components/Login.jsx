import { useState } from "react";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Login.css";

const Login = () => {
  const [companyCode, setCompanyCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const companyDocRef = doc(db, "CorporateClient", companyCode);
      const companySnapshot = await getDoc(companyDocRef);

      if (companySnapshot.exists()) {
        localStorage.setItem("companyCode", companyCode); // Save the actual code
        navigate("/register"); // Navigate to student registration or dashboard
      } else {
        alert("Invalid Company Code");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login with Company Code</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Enter Company Code"
          value={companyCode}
          onChange={(e) => setCompanyCode(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
