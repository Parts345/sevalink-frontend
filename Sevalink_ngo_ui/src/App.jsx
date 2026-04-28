import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { volunteerSkills } from "./data";
import { DashboardPage } from "./pages/DashboardPage";
import { NgoNeedsPage } from "./pages/NgoNeedsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Insights from "./pages/Insights";

import { getTasks } from "./services/api";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [volunteer, setVolunteer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeRole, setActiveRole] = useState("volunteer");
  const [token, setToken] = useState("");

  const isMainApp = location.pathname === "/" || location.pathname === "/ngo";

  // 🔥 AUTO LOGIN (NO API CALL)
  useEffect(() => {
    const volunteerToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWU0MWY4NDg4ODVjOGRjNjk5NzE2NjAiLCJyb2xlIjoidm9sdW50ZWVyIiwiaWF0IjoxNzc2NTU5MDY3LCJleHAiOjE3NzcxNjM4Njd9.QKrGdyVeC7xmXsXXkPOExIzsPAy1LkmsZLwxZrffjW4";

    const ngoToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWU0MjA1MTg4ODVjOGRjNjk5NzE2NjUiLCJyb2xlIjoibmdvIiwiaWF0IjoxNzc2NTU4MTkyLCJleHAiOjE3NzcxNjI5OTJ9.XOvm_I4FW3WjwRu4kjUd8T58SZvl9jPzJ0N89HK-VAU";

    const selectedToken =
      activeRole === "volunteer" ? volunteerToken : ngoToken;

    localStorage.setItem("token", selectedToken);
    setToken(selectedToken);

    setVolunteer({
      name: activeRole === "volunteer" ? "Sanket" : "NGO Admin",
      email:
        activeRole === "volunteer"
          ? "sanket@gmail.com"
          : "ngo@gmail.com",
      role: activeRole,
      isLoggedIn: true,
      skills: [],
      availability: [],
      location: { city: "Mumbai" }
    });
  }, [activeRole]);

  // 🔥 ALWAYS FETCH TASKS (NO MATCH FILTER)
  const refreshTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.tasks || []);
      setPosts(res.tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    if (token) refreshTasks();
  }, [token, activeRole]);

  const taskStats = useMemo(() => {
    const accepted = tasks.filter(
      (task) => task.status === "closed" || task.status === "filled"
    ).length;
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
          <NavLink to="/admin">Admin View</NavLink>
        </nav>
      </header>

      {isMainApp && (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">Simple clean layout for volunteers + NGOs</p>
              <h2>Help the right volunteer reach the right need at the right time.</h2>

              <p className="hero-copy">
                SevaLink keeps volunteering easy. Volunteers can sign in,
                pick their strengths, and respond to nearby tasks.
              </p>

              <div style={{ marginTop: "24px" }}>
                <button
                  className="primary-button"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 500, behavior: "smooth" });
                  }}
                >
                  Open Dashboard
                </button>
              </div>
            </div>

            <div className="hero-stats">
              <article><strong>{taskStats.total}</strong><span>active requests</span></article>
              <article><strong>{taskStats.open}</strong><span>ready to accept</span></article>
              <article><strong>{posts.length}</strong><span>NGO posts</span></article>
            </div>
          </section>

          <div className="role-switcher">
            <button
              className={activeRole === "volunteer" ? "active" : ""}
              onClick={() => setActiveRole("volunteer")}
            >
              Volunteer
            </button>

            <button
              className={activeRole === "ngo" ? "active" : ""}
              onClick={() => setActiveRole("ngo")}
            >
              NGO
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
              volunteerSkills={volunteerSkills}
            />
          }
        />

        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/insights" element={<Insights />} />
      </Routes>
    </div>
  );
}