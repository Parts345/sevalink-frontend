import { useState, useEffect } from "react";
import { NgoPostCard } from "../components/NgoPostCard";
import { createTask } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  needTitle: "",
  area: "",
  volunteersNeeded: 5,
  skill: "Teaching",
  urgency: "Medium",
  description: ""
};

export function NgoNeedsPage({ volunteerSkills }) {
  const [form, setForm] = useState(initialForm);
  const [livePosts, setLivePosts] = useState([]);

  const fetchTasksFromDB = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      const data = await response.json();
      setLivePosts(data.tasks || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasksFromDB();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "volunteersNeeded" ? Number(value) : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let lat = 19.076;
      let lng = 72.8777;

      const payload = {
        title: form.needTitle,
        description: form.description,
        volunteersNeeded: form.volunteersNeeded,
        urgency: form.urgency.toLowerCase(),
        requiredSkills: [form.skill],
        status: "open",
        location: {
          label: form.area,
          city: "Mumbai",
          coordinates: { lat, lng }
        }
      };

      await createTask(payload);

      setForm(initialForm);
      fetchTasksFromDB();

      alert("✅ Request published!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to publish");
    }
  }

  return (
    <main className="content-grid ngo-grid">
      
      {/* 🔥 LEFT PANEL (FIXED FORM) */}
      <section className="panel form-panel">
        <div className="panel-heading">
          <h3>Post NGO Need</h3>
        </div>

        <form className="need-form" onSubmit={handleSubmit}>
          
          <label>
            Title
            <input
              name="needTitle"
              value={form.needTitle}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Area
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-row">
            <label>
              Skill
              <select name="skill" value={form.skill} onChange={handleChange}>
                {volunteerSkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </label>

            <label>
              Volunteers Needed
              <input
                type="number"
                name="volunteersNeeded"
                min="1"
                value={form.volunteersNeeded}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Urgency
            <select name="urgency" value={form.urgency} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>

          <button className="primary-button full-width" type="submit">
            Publish Request
          </button>
        </form>
      </section>

      {/* 🔥 RIGHT PANEL (POSTS) */}
      <section className="panel ngo-posts-panel">
        <div className="panel-heading">
          <h3>{livePosts.length} Requests</h3>
        </div>

        <div className="ngo-post-list">
          {livePosts.length > 0 ? (
            livePosts.map((post) => (
              <NgoPostCard key={post._id} post={post} />
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </section>
    </main>
  );
}