import "../styles/Home.css";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <><Navbar />
    <div className="home-container">
      
      <h1>📘 Welcome to the Student Dashboard</h1>
      <p>
        This dashboard is designed to help you manage student records effectively. 
        It provides functionalities to:
      </p>
      <ul>
        <li>Register new students</li>
        <li>Track and update attendance</li>
        <li>Manage assignment or exam marks</li>
        <li>View student data with ease</li>
      </ul>
      <p>
        Use the navigation bar above to access different features of the platform.
      </p>
    </div>
    </>
  );
};

export default Home;
