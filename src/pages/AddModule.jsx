import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  setDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/ModuleForm.css";
import Navbar from "../components/Navbar";

const AddModule = () => {
  const [companyCode, setCompanyCode] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [modulename, setModulename] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [modules, setModules] = useState([]);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const code = localStorage.getItem("companyCode");
    if (code) {
      setCompanyCode(code);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (companyCode) {
      const moduleRef = collection(db, "CorporateClient", companyCode, "moduleinfo");
      const q = query(moduleRef, orderBy("startDate", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const moduleList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModules(moduleList);
      });
      return () => unsubscribe();
    }
  }, [companyCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingModuleId && moduleId.trim() === "") {
      alert("Please provide a Module ID.");
      return;
    }

    try {
      const moduleDocRef = doc(
        db,
        "CorporateClient",
        companyCode,
        "moduleinfo",
        editingModuleId || moduleId
      );

      if (!editingModuleId) {
        const existingDoc = await getDoc(moduleDocRef);
        if (existingDoc.exists()) {
          alert("A module with this ID already exists. Please choose a different ID.");
          return;
        }
      }

      await setDoc(moduleDocRef, {
        modulename,
        startDate,
        endDate,
        description,
        status,
      });

      alert(editingModuleId ? "Module updated successfully!" : "Module added successfully!");

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error saving module:", error);
      alert("Something went wrong.");
    }
  };

  const handleEditClick = (module) => {
    setModuleId(module.id);
    setModulename(module.modulename);
    setStartDate(module.startDate);
    setEndDate(module.endDate);
    setDescription(module.description);
    setStatus(module.status || "In Progress");
    setEditingModuleId(module.id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this module?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "CorporateClient", companyCode, "moduleinfo", id));
        if (editingModuleId === id) {
          resetForm();
        }
        alert("Module deleted.");
      } catch (error) {
        console.error("Error deleting module:", error);
        alert("Failed to delete module.");
      }
    }
  };

  const resetForm = () => {
    setModuleId("");
    setModulename("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setStatus("In Progress");
    setEditingModuleId(null);
  };

  return (
    <>
      <Navbar />
      <div className="module-layout">
        {/* Left Column - Modules List */}
        <div className="module-list">
          <h3>Existing Modules</h3>
          {modules.map((module) => (
            <div
              key={module.id}
              className={`module-card ${editingModuleId === module.id ? "active" : ""}`}
              onClick={() => handleEditClick(module)}
            >
              <h4>{module.modulename}</h4>
              <p><strong>ID:</strong> {module.id}</p>
              <p><strong>Start:</strong> {module.startDate}</p>
              <p><strong>End:</strong> {module.endDate}</p>
              <p><strong>Status:</strong> {module.status || "In Progress"}</p>
              <p>{module.description}</p>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(module.id); }}>Delete</button>
            </div>
          ))}
        </div>

        {/* Right Column - Form */}
        <div className="module-form-container">
          <h2>{editingModuleId ? "Edit Module" : "Add Module"}</h2>

          {editingModuleId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                marginBottom: "1rem",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              + Add New Module
            </button>
          )}

          <form onSubmit={handleSubmit} className="module-form">
            {!editingModuleId && (
              <input
                type="text"
                placeholder="Module ID"
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                required
              />
            )}
            <input
              type="text"
              placeholder="Module Name"
              value={modulename}
              onChange={(e) => setModulename(e.target.value)}
              required
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <textarea
              placeholder="Module Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button type="submit">
              {editingModuleId ? "Update Module" : "Add Module"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddModule;
