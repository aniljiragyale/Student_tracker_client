import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegisterStudent from "./pages/RegisterStudent";
import UpdateAttendance from "./pages/UpdateAttendance";
import UpdateMarks from "./pages/UpdateMarks";
import SharePage from "./pages/SharePage";
import LoginPage from "./pages/Login";
import AddModule from "./pages/AddModule";
import Admincontrol from "./components/Studentdetails";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/add-module" element={<AddModule />} />
        <Route path="/admin_panel" element={<Admincontrol/>}/>
        <Route path="/cpanel" element={<RegisterStudent />} />
        <Route path="/update-attendance" element={<UpdateAttendance />} />
        <Route path="/update-marks" element={<UpdateMarks />} />
        <Route path="/share" element={<SharePage />} />
        

      </Routes>
    </Router>
  );
}

export default App;
