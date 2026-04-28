import { useMemo, useState, useEffect } from "react";
import { SkillPill } from "../components/SkillPill";
import { TaskCard } from "../components/TaskCard";
import { TaskMap } from "../components/TaskMap";

export function DashboardPage({
  activeRole,
  onToggleSkill,
  skills,
  tasks,
  volunteer,
  refreshTasks
}) {
  // 1. Create a local state to hold tasks
  const [localTasks, setLocalTasks] = useState(tasks || []);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");

  // 2. Self-Healing Fetch: If the page reloads, grab data directly from the DB
  useEffect(() => {
    const fetchLiveTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks");
        const data = await response.json();
        setLocalTasks(data.tasks || []);
      } catch (err) {
        console.error("Failed to load tasks on dashboard refresh:", err);
      }
    };
    fetchLiveTasks();
  }, []);

  // 3. Fallback Volunteer Profile (Prevents the "Loading..." stuck state)
  const safeVolunteer = volunteer || {
    name: "Soham (Test Volunteer)",
    email: "volunteer@sevalink.com",
    isLoggedIn: true,
    location: { city: "Navi Mumbai" },
    availability: ["Weekends"],
    skills: ["Teaching"]
  };

  const filteredTasks = useMemo(() => {
    if (selectedFilter === "All") {
      return localTasks; // Use localTasks instead of safeTasks
    }
    return localTasks.filter((task) => task.requiredSkills?.includes(selectedFilter));
  }, [selectedFilter, localTasks]);

  const selectedTask =
    filteredTasks?.find((task) => (task._id || task.taskId) === selectedTaskId) ||
    filteredTasks?.[0] ||
    null;

  return (
    <main className="content-grid">
      {/* ================= LEFT PANEL ================= */}
      <section className="panel volunteer-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Volunteer profile</p>
            <h3>{safeVolunteer.name}</h3>
          </div>
          <span className="status-pill">
            {safeVolunteer.isLoggedIn ? "Ready to volunteer" : "Connecting..."}
          </span>
        </div>

        <div className="volunteer-summary">
          <article>
            <span>Email</span>
            <strong>{safeVolunteer.email || "-"}</strong>
          </article>
          <article>
            <span>Location</span>
            <strong>{safeVolunteer.location?.label || safeVolunteer.location?.city || "-"}</strong>
          </article>
          <article>
            <span>Availability</span>
            <strong>{safeVolunteer.availability?.join(", ") || "-"}</strong>
          </article>
        </div>

        <div className="skills-section">
          <div className="section-title-row">
            <h4>What can you help with?</h4>
            <span>{safeVolunteer.skills?.length || 0} skills selected</span>
          </div>

          <div className="skills-wrap">
            {skills?.map((skill) => (
              <SkillPill
                active={safeVolunteer.skills?.includes(skill)}
                key={skill}
                onClick={() => onToggleSkill(skill)}
              >
                {skill}
              </SkillPill>
            ))}
          </div>
        </div>

        <div className="login-card">
          <h4>Testing Data</h4>
          <p>Logged in automatically as: <b>{safeVolunteer.email}</b></p>
          <p className="muted">
            Toggle roles above to switch between NGO and Volunteer accounts.
          </p>
        </div>
      </section>

      {/* ================= TASK PANEL ================= */}
      <section className="panel task-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Nearby opportunities</p>
            <h3>Available tasks near you</h3>
          </div>
          <span className="status-pill">{activeRole} mode</span>
        </div>

        <div className="info-banner">
          Choose a skill filter to narrow the list.
        </div>

        <div className="filters">
          {["All", ...(skills || [])].map((skill) => (
            <button
              className={selectedFilter === skill ? "active" : ""}
              key={skill}
              onClick={() => setSelectedFilter(skill)}
              type="button"
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            filteredTasks.map((task) => {
              const taskId = task._id || task.taskId;
              return (
                <div
                  className={`task-list-item ${selectedTaskId === taskId ? "selected" : ""}`}
                  key={taskId}
                  onClick={() => setSelectedTaskId(taskId)}
                  role="button"
                  tabIndex={0}
                >
                  <TaskCard task={task} refreshTasks={refreshTasks} />
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ================= MAP PANEL ================= */}
      {selectedTask ? (
        <TaskMap selectedTask={selectedTask} />
      ) : (
        <section className="panel map-panel empty-state">
          <h3>No matching tasks yet</h3>
          <p>Try another skill filter or add a new NGO request.</p>
        </section>
      )}
    </main>
  );
}