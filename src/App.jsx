import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterStudent from "./pages/RegisterStudent";
import UpdateAttendance from "./pages/UpdateAttendance";
import UpdateMarks from "./pages/UpdateMarks";
import SharePage from "./pages/SharePage";
import LoginPage from "./pages/Login";

import Admincontrol from "./components/Studentdetails";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/cpanel" element={<Home />} />
        <Route path="/admin_panel" element={<Admincontrol/>}/>
        <Route path="/register" element={<RegisterStudent />} />
        <Route path="/update-attendance" element={<UpdateAttendance />} />
        <Route path="/update-marks" element={<UpdateMarks />} />
        <Route path="/share" element={<SharePage />} />
        

      </Routes>
    </Router>
  );
}

export default App;
