import { useState, useEffect } from "react"; // ✅ ADDED useEffect
import { NgoPostCard } from "../components/NgoPostCard";
import { createTask } from "../services/api"; 

const initialForm = {
  needTitle: "",
  area: "",
  volunteersNeeded: 5,
  skill: "Teaching",
  urgency: "Medium",
  description: ""
};

// You can ignore the 'posts' prop now, we will manage it locally
export function NgoNeedsPage({ volunteerSkills }) {
  const [form, setForm] = useState(initialForm);
  const [livePosts, setLivePosts] = useState([]); // ✅ NEW: Local state for posts

  // ✅ NEW: Fetch data when the page loads
  const fetchTasksFromDB = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      // Look for the tasks array in the response (based on your earlier backend structure)
      setLivePosts(data.tasks || []); 
    } catch (err) {
      console.error("Failed to load tasks on refresh:", err);
    }
  };

  // Run this once when the component mounts
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

      if (apiKey && apiKey !== "i will paste the api key will not send it to you") {
        const address = encodeURIComponent(`${form.area}, Maharashtra, India`);
        const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
        const geoData = await geoRes.json();
        
        if (geoData.results && geoData.results.length > 0) {
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
          label: form.area || "Mumbai Area",
          city: "Mumbai",
          coordinates: { lat, lng }
        }
      };

      const data = await createTask(payload);
      
      setForm(initialForm);
      // ✅ NEW: Call our fetch function to update the list immediately after posting
      fetchTasksFromDB(); 
      alert("Success! Request published to SevaLink.");

    } catch (err) {
      console.error("ERROR:", err);
      alert("Network error: Could not reach the backend.");
    }
  }

  return (
    <main className="content-grid ngo-grid">
      <section className="panel form-panel">
        {/* ... Keep all your form JSX exactly the same ... */}
        <div className="panel-heading">
          <div>
            <p className="eyebrow">NGO request form</p>
            <h3>Share a volunteer request</h3>
          </div>
          <span className="status-pill">Live posting</span>
        </div>

        <form className="need-form" onSubmit={handleSubmit}>
            {/* ... Your inputs ... */}
          <label>
            Need title
            <input name="needTitle" onChange={handleChange} required value={form.needTitle} />
          </label>
          <label>
            Area
            <input name="area" onChange={handleChange} required value={form.area} />
          </label>
          <div className="form-row">
            <label>
              Skill Required
              <select name="skill" onChange={handleChange} value={form.skill}>
                {volunteerSkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </label>
            <label>
              Volunteers needed
              <input min="1" name="volunteersNeeded" onChange={handleChange} required type="number" value={form.volunteersNeeded} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Urgency Level
              <select name="urgency" onChange={handleChange} value={form.urgency}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
          </div>
          <label>
            Description
            <textarea name="description" onChange={handleChange} required rows="5" value={form.description} />
          </label>
          <button className="primary-button full-width" type="submit">Publish Request</button>
        </form>
      </section>

      <section className="panel ngo-posts-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Submitted NGO needs</p>
            <h3>Recent requests</h3>
          </div>
          {/* ✅ UPDATED: Use livePosts.length */}
          <span className="status-pill">{livePosts.length} total</span>
        </div>

        <div className="ngo-post-list">
          {/* ✅ UPDATED: Map over livePosts instead of posts */}
          {livePosts.length > 0 ? (
             livePosts.map((post) => (
              <NgoPostCard key={post._id || post.taskId} post={post} />
            ))
          ) : (
            <p className="muted">No posts found in database.</p>
          )}
        </div>
      </section>
    </main>
  );
}