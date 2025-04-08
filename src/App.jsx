
import StudentAttendanceSummary from "./components/RegisterStudent";
import LoginPage from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/register" element={<StudentAttendanceSummary />}/>
      </Routes>
      </Router>    
    </div>
  );
}

export default App;
