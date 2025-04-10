import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Login.css"; // Make sure this path is correct

const LoginPage = () => {
  const [companyCode, setCompanyCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Autofill company code from localStorage if available
  useEffect(() => {
    const savedCode = localStorage.getItem("companyCode");
    if (savedCode) {
      setCompanyCode(savedCode);
    }
  }, []);

  const handleLogin = async () => {
    setError("");

    if (!companyCode.trim()) {
      setError("Please enter a company code");
      return;
    }

    try {
      const code = companyCode.trim().toUpperCase();
      const docRef = doc(db, "CorporateClient", code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // ✅ Store companyCode locally
        localStorage.setItem("companyCode", code);

        if (password === data.adminPassword) {
          navigate("/cpanel");
        } else {
          navigate("/admin_panel");
        }
      } else {
        setError("Invalid Company Code");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>
          Welcome to <span className="highlight">EduTech Portal</span>
        </h1>
        <div className="info-box">
          <h3>For Students</h3>
          <p>Enter your company code to access your dashboard.</p>
        </div>
        <div className="info-box">
          <h3>For Admins</h3>
          <p>Enter your company code and admin password to manage data.</p>
        </div>
      </div>
      <div className="login-right">
        <h2>Login</h2>
        <p>Please enter your credentials to continue.</p>
        <div className="login-form">
          <input
            type="text"
            placeholder="Enter Company Code"
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Admin Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
