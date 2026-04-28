const API_BASE_URL = import.meta.env.VITE_API_URL;

export function TaskCard({ task, refreshTasks }) {
  const isFull = task.filledSlots >= task.volunteersNeeded || task.status === "closed";
  const taskId = task.taskId || task._id;

  const acceptTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to accept task");
      } else {
        if (refreshTasks) refreshTasks();
      }
    } catch (error) {
      console.error("Error accepting task:", error);
      alert("Network error: Could not reach backend");
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