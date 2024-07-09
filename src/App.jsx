import { Navigate, Route, Routes } from "react-router-dom";
import UserPanel from "./components/user/UserPanel";
import AdminPanel from "./components/admin/AdminPanel";
import Login from "./components/auth/Login";
import LogoutPage from "./components/auth/LogoutPage";
import Register from "./components/auth/Register";
import PrivateRoute from "./routes/PrivateRoutes";
import ExamDashboard from "./components/exam/ExamDashboard";
const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/user" />} />
          <Route path="/user/*" element={<UserPanel />} />
          <Route path="/take-exam/:examId" element={<ExamDashboard />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/log-out" element={<LogoutPage />} />
        </Route>
        <Route path="/exam" element={<ExamDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
