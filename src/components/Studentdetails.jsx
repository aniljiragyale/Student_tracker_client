import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./Studentdetails.css";

ChartJS.register(
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

const RegisterStudent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [companyCode, setCompanyCode] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [overallAttendance, setOverallAttendance] = useState({ present: 0, absent: 0, late: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("studentDetails");
  const [moduleInfo, setModuleInfo] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("companyCode");
    navigate("/");
  };

  useEffect(() => {
    const codeFromState = location.state?.companyName;
    const codeFromStorage = localStorage.getItem("companyCode");

    if (codeFromState) {
      setCompanyCode(codeFromState);
      localStorage.setItem("companyCode", codeFromState);
    } else if (codeFromStorage) {
      setCompanyCode(codeFromStorage);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!companyCode) return;
      try {
        const studentsRef = collection(db, "CorporateClient", companyCode, "studentinfo");
        const snapshot = await getDocs(studentsRef);
        const studentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        studentList.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(studentList);

        let present = 0, absent = 0, late = 0;
        studentList.forEach((student) => {
          const attendance = student.attendance || {};
          Object.values(attendance).forEach((status) => {
            if (status === "Present") present++;
            else if (status === "Absent") absent++;
            else if (status === "Late Came") late++;
          });
        });
        setOverallAttendance({ present, absent, late });
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [companyCode]);

  const fetchModules = async () => {
    if (!companyCode) return;

    try {
      const moduleRef = collection(db, "CorporateClient", companyCode, "moduleinfo");
      const snapshot = await getDocs(moduleRef);
      const modules = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setModuleInfo(modules);
      setActiveView("moduleInfo"); // Switch view
    } catch (error) {
      console.error("Error fetching module info:", error);
    }
  };

  const getAttendanceCounts = (attendance = {}) => {
    let present = 0, absent = 0, late = 0;
    Object.values(attendance).forEach((status) => {
      if (status === "Present") present++;
      else if (status === "Absent") absent++;
      else if (status === "Late Came") late++;
    });
    return { present, absent, late };
  };

  const getMarksData = (marks = {}) => {
    const labels = Object.keys(marks);
    const assignmentData = labels.map((mod) => marks[mod]?.assignment || 0);
    const quizData = labels.map((mod) => marks[mod]?.quiz || 0);

    return {
      labels,
      datasets: [
        { label: "Assignment", data: assignmentData, backgroundColor: "#42A5F5" },
        { label: "Quiz", data: quizData, backgroundColor: "#66BB6A" },
      ],
    };
  };

  const getPieData = (attendance) => {
    const { present, absent, late } = getAttendanceCounts(attendance);
    return {
      labels: ["Present", "Absent", "Late Came"],
      datasets: [
        {
          data: [present, absent, late],
          backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
        },
      ],
    };
  };

  const filteredStudents = [...students].filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="register-student-container">
      <div className="top-bar">
        <h2>📋 Student Dashboard - {companyCode}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* View Switch Buttons */}
      <div className="view-buttons">
        <button onClick={() => setActiveView("studentDetails")}>👤 Student Details</button>
        <button onClick={() => setActiveView("marksSummary")}>📘 Overall Marksheet Summary</button>
        <button onClick={() => setActiveView("attendanceSummary")}>🎯 Overall Attendance Summary</button>
        <button onClick={fetchModules}>📚 View Modules</button>
      </div>

      {/* Search for Student */}
      {activeView === "studentDetails" && (
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Student Cards */}
      {activeView === "studentDetails" && (
        <div className="student-grid">
          {filteredStudents.map((student) => {
            const { present, absent, late } = getAttendanceCounts(student.attendance);
            return (
              <div className="student-card" key={student.id}>
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                </div>
                <div className="attendance-row">
                  <div className="attendance-item present">{present}</div>
                  <div className="attendance-item absent">{absent}</div>
                  <div className="attendance-item late">{late}</div>
                </div>
                <button onClick={() => setSelectedStudent(student)}>View More</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Marksheet Summary Table */}
      {activeView === "marksSummary" && (
        <div className="marks-table" style={{ marginTop: "3rem", overflowX: "auto" }}>
          <h2>📘 Overall Students Marksheet</h2>
          {(() => {
            const allModules = new Set();
            filteredStudents.forEach((student) => {
              const marks = student.marks || {};
              Object.keys(marks).forEach((module) => allModules.add(module));
            });
            const moduleList = Array.from(allModules);

            return (
              <table border="1" cellPadding="8" cellSpacing="0" width="100%">
                <thead>
                  <tr>
                    <th rowSpan="2">Name</th>
                    {moduleList.map((module) => (
                      <th colSpan="2" key={module}>{module}</th>
                    ))}
                  </tr>
                  <tr>
                    {moduleList.map((module) => (
                      <React.Fragment key={`${module}-sub`}>
                        <th>Assignment</th>
                        <th>Quiz</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const marks = student.marks || {};
                    return (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        {moduleList.map((module) => (
                          <React.Fragment key={`${student.id}-${module}`}>
                            <td>{marks[module]?.assignment ?? "-"}</td>
                            <td>{marks[module]?.quiz ?? "-"}</td>
                          </React.Fragment>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })()}
        </div>
      )}

      {/* Attendance Summary Pie */}
      {activeView === "attendanceSummary" && (
        <div className="overall-summary" style={{ marginTop: "2rem" }}>
          <h2>🧾 Overall Attendance Summary</h2>
          <div style={{ maxWidth: "300px", margin: "0 auto" }}>
            <Pie
              data={{
                labels: ["Present", "Absent", "Late Came"],
                datasets: [
                  {
                    data: [
                      overallAttendance.present,
                      overallAttendance.absent,
                      overallAttendance.late,
                    ],
                    backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                  datalabels: {
                    formatter: (value, context) => {
                      const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                      return total === 0 ? "0%" : ((value / total) * 100).toFixed(1) + "%";
                    },
                    color: "#fff",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Module Info Section */}
            {activeView === "moduleInfo" && moduleInfo.length > 0 && (
            <div className="module-info-container">
              <h2>📚 Module Information</h2>
              <div className="module-grid">
                {moduleInfo.map((mod) => (
                  <div className="module-card" key={mod.id}>
                    <div className={`module-status ${mod.status.replace(/\s+/g, "").toLowerCase()}`}>
                      {mod.status}
                    </div>
                    <h3>{mod.modulename}</h3>
                    <p><strong>Start Date:</strong> {mod.startDate}</p>
                    <p><strong>End Date:</strong> {mod.endDate}</p>
                    <p><strong>Description:</strong> {mod.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}




      {/* Modal Popup for Student Details */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedStudent(null)}>Close</button>
            <h2>{selectedStudent.name}'s Details</h2>
            <p>Email: {selectedStudent.email}</p>

            <h3>📅 Attendance Summary</h3>
            {(() => {
              const attendance = selectedStudent.attendance || {};
              const presentDates = [];
              const absentDates = [];
              const lateDates = [];

              Object.entries(attendance).forEach(([date, status]) => {
                if (status === "Present") presentDates.push(date);
                else if (status === "Absent") absentDates.push(date);
                else if (status === "Late Came") lateDates.push(date);
              });

              return (
                <ul>
                  <li><strong>Present Days:</strong> {presentDates.length}</li>
                  <ul>{presentDates.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  <li><strong>Absent Days:</strong> {absentDates.length}</li>
                  <ul>{absentDates.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  <li><strong>Late Came Days:</strong> {lateDates.length}</li>
                  <ul>{lateDates.map((d, i) => <li key={i}>{d}</li>)}</ul>
                </ul>
              );
            })()}

            <h3>📘 Marks</h3>
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <Bar
                data={getMarksData(selectedStudent.marks)}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" },
                    datalabels: {
                      anchor: "end",
                      align: "top",
                      color: "#000",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 10 },
                    },
                  },
                }}
                height={250}
              />
            </div>

            <h3 style={{ marginTop: "1.5rem" }}>🎯 Attendance Chart</h3>
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
              <Pie data={getPieData(selectedStudent.attendance)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterStudent;
