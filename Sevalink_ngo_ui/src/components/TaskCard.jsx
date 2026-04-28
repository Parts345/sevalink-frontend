const API_BASE_URL = import.meta.env.VITE_API_URL;

export function TaskCard({ task, refreshTasks }) {
  const isFull = task.filledSlots >= task.volunteersNeeded || task.status === "closed";
  const taskId = task.taskId || task._id;

  const API_BASE_URL = import.meta.env.VITE_API_URL;

const acceptTask = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Auto login failed.");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",   // 🔥 IMPORTANT
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Backend error:", data);
      alert(data.message || "Failed to accept task");
    } else {
      alert("✅ Task accepted!");
      if (refreshTasks) refreshTasks();
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    alert("Network error");
  }
};

  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <span className={`badge urgency-${task.urgency?.toLowerCase()}`}>
            {task.urgency} Priority
          </span>
          <h3>{task.title}</h3>
          <p>
            {task.ngoName || task.postedBy?.ngoName} - {task.location?.city || task.location?.label}
          </p>
        </div>
        <span className="task-distance">
          {task.distanceKm ? `${task.distanceKm} km` : "N/A"}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <dl className="task-meta">
        <div>
          <dt>Skill</dt>
          <dd>{task.requiredSkills?.join(", ") || "Any"}</dd>
        </div>
        <div>
          <dt>Volunteers</dt>
          <dd>
            {task.filledSlots || 0}/{task.volunteersNeeded}
          </dd>
        </div>
        <div>
          <dt>Match Score</dt>
          <dd>{task.matchScore ? `${task.matchScore}/100` : "N/A"}</dd>
        </div>
      </dl>

      <div className="task-actions">
        <button
          className="primary-button"
          disabled={isFull}
          onClick={(e) => {
            e.stopPropagation();
            acceptTask();
          }}
        >
          {isFull ? "Closed" : "Accept Task"}
        </button>
      </div>
    </article>
  );
}