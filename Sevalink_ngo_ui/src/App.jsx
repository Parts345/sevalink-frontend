import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { volunteerSkills } from "./data";
import { DashboardPage } from "./pages/DashboardPage";
import { NgoNeedsPage } from "./pages/NgoNeedsPage";
// ✅ Import your new Admin pages
import AdminDashboardPage from "./pages/AdminDashboardPage"; 
import Insights from "./pages/Insights"; 

import { loginUser, getMatches, getTasks } from "./services/api";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Hook to check current URL
  const [volunteer, setVolunteer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeRole, setActiveRole] = useState("volunteer");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ✅ Check if we are on the main volunteer or NGO pages
  const isMainApp = location.pathname === "/" || location.pathname === "/ngo";

  useEffect(() => {
    const handleAutoLogin = async () => {
      const creds = activeRole === "volunteer"
        ? { email: "aarav@example.org", password: "password123" }
        : { email: "relief@example.org", password: "password123" };
      
      try {
        const res = await loginUser(creds);
        if (res.token) {
          setToken(res.token);
          localStorage.setItem("token", res.token);
          setVolunteer({ ...res.user, isLoggedIn: true });
        }
      } catch (err) {
        console.error("Login failed:", err);
      }
    };
    handleAutoLogin();
  }, [activeRole]);

  const refreshTasks = async () => {
    try {
      if (activeRole === "volunteer" && token) {
        const res = await getMatches(token);
        setTasks(res.matches || []);
      } else {
        const res = await getTasks();
        setTasks(res.tasks || []);
        setPosts(res.tasks || []); 
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    if (token) refreshTasks();
  }, [token, activeRole]);

  const taskStats = useMemo(() => {
    const accepted = tasks.filter((task) => task.status === "closed" || task.status === "filled").length;
    const open = tasks.filter((task) => task.status === "open").length;
    return {
      accepted,
      open,
      total: tasks.length
    };
  }, [tasks]);

  function handleToggleSkill(skill) {
    if (!volunteer) return;
    setVolunteer((current) => {
      const hasSkill = current.skills.includes(skill);
      return {
        ...current,
        skills: hasSkill
          ? current.skills.filter((item) => item !== skill)
          : [...current.skills, skill]
      };
    });
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Volunteer support app for NGOs</p>
          <h1>SevaLink</h1>
        </div>
        <nav className="nav">
          <NavLink to="/" end>Volunteer Home</NavLink>
          <NavLink to="/ngo">Post NGO Need</NavLink>
          {/* ✅ Link to the Admin Dashboard */}
          <NavLink to="/admin">Admin View</NavLink> 
        </nav>
      </header>

      {/* ✅ ONLY render Hero and Role Switcher if on main pages */}
      {isMainApp && (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">Simple clean layout for volunteers + NGOs</p>
              <h2>Help the right volunteer reach the right need at the right time.</h2>
              <p className="hero-copy">
                SevaLink keeps volunteering easy. Volunteers can sign in, pick their
                strengths, and respond to nearby tasks in a few taps. NGOs can post
                urgent needs and make them visible to the local volunteer network.
              </p>
              <div className="hero-steps">
                <article><strong>1</strong><span>Choose skills and location</span></article>
                <article><strong>2</strong><span>Review nearby requests</span></article>
                <article><strong>3</strong><span>Accept tasks or post a need</span></article>
              </div>
              
              <div style={{ marginTop: "24px" }}>
                <button 
                  className="primary-button" 
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 500, behavior: "smooth" });
                  }}
                  type="button"
                >
                  Open Dashboard
                </button>
              </div>
            </div>
            <div className="hero-stats">
              <article><strong>{taskStats.total}</strong><span>active requests</span></article>
              <article><strong>{taskStats.open}</strong><span>ready to accept</span></article>
              <article><strong>{posts.length}</strong><span>NGO posts shared</span></article>
            </div>
          </section>

          <div className="role-switcher" aria-label="Role switcher">
            <button
              className={activeRole === "volunteer" ? "active" : ""}
              onClick={() => setActiveRole("volunteer")}
              type="button"
            >
              I am a Volunteer
            </button>
            <button
              className={activeRole === "ngo" ? "active" : ""}
              onClick={() => setActiveRole("ngo")}
              type="button"
            >
              I represent an NGO
            </button>
          </div>
        </>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              activeRole={activeRole}
              onToggleSkill={handleToggleSkill}
              skills={volunteerSkills}
              tasks={tasks}
              volunteer={volunteer}
              refreshTasks={refreshTasks}
            />
          }
        />
        <Route
          path="/ngo"
          element={
            <NgoNeedsPage
              posts={posts}
              volunteerSkills={volunteerSkills}
              refreshTasks={refreshTasks}
            />
          }
        />
        {/* ✅ Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/insights" element={<Insights />} />
      </Routes>
    </div>
  );
}