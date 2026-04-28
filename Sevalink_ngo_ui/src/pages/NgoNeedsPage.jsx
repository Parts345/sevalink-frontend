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

  // ✅ FIXED FETCH
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

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "volunteersNeeded" ? Number(value) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      let lat = 19.076;
      let lng = 72.8777;

      if (apiKey) {
        const address = encodeURIComponent(`${form.area}, Maharashtra, India`);
        const geoRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
        );
        const geoData = await geoRes.json();

        if (geoData.results?.length > 0) {
          lat = geoData.results[0].geometry.location.lat;
          lng = geoData.results[0].geometry.location.lng;
        }
      }

      const payload = {
        title: form.needTitle,
        description: form.description,
        volunteersNeeded: Number(form.volunteersNeeded),
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

      alert("Success! Request published.");
    } catch (err) {
      console.error("ERROR:", err);
      alert("Network error: Could not reach backend.");
    }
  }

  return (
    <main className="content-grid ngo-grid">
      <section className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <input name="needTitle" value={form.needTitle} onChange={handleChange} />
          <input name="area" value={form.area} onChange={handleChange} />

          <button type="submit">Publish</button>
        </form>
      </section>

      <section className="panel ngo-posts-panel">
        <span>{livePosts.length} total</span>

        {livePosts.length > 0 ? (
          livePosts.map((post) => (
            <NgoPostCard key={post._id || post.taskId} post={post} />
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </main>
  );
}