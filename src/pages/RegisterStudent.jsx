import { useState, useEffect } from "react";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/RegisterStudent.css";

const RegisterStudent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [companyCode, setCompanyCode] = useState("");
  const [student, setStudent] = useState({
    studentId: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedCompanyCode =
      location.state?.companyCode || localStorage.getItem("companyCode");

    if (!storedCompanyCode) {
      alert("Company code missing. Please login again.");
      navigate("/");
    } else {
      setCompanyCode(storedCompanyCode);
      localStorage.setItem("companyCode", storedCompanyCode);
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!student.studentId.trim() || !companyCode) return;

      try {
        const docRef = doc(
          db,
          `CorporateClient/${companyCode}/studentinfo`,
          student.studentId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStudent({
            studentId: data.studentId || "",
            name: data.name || "",
            email: data.email || "",
          });
        } else {
          setStudent((prev) => ({ ...prev, name: "", email: "" }));
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [student.studentId, companyCode]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !student.studentId.trim() ||
      !student.name.trim() ||
      !student.email.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const docRef = doc(
        db,
        `CorporateClient/${companyCode}/studentinfo`,
        student.studentId
      );

      await setDoc(docRef, {
        studentId: student.studentId,
        name: student.name,
        email: student.email,
      });

      alert("Student registered/updated successfully!");
      setStudent({ studentId: "", name: "", email: "" });
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Register or Update Student</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={student.studentId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={student.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={handleChange}
            required
          />
          <button type="submit">Register / Update</button>
        </form>
      </div>
    </>
  );
};

export default RegisterStudent;
