export function NgoPostCard({ post }) {
  return (
    <article className="ngo-post-card">
      <div className="ngo-post-header">
        <div>
          <span className={`badge urgency-${post.urgency?.toLowerCase() || 'medium'}`}>
            {post.urgency || "Medium"}
          </span>
          <h3>{post.title}</h3>
          {/* ✅ FIX APPLIED: Fallback to volunteer name if no NGO name exists */}
          <p>{post.postedBy?.ngoName || post.postedBy?.name || "Independent Volunteer"}</p>
        </div>
      </div>

      <p>{post.description}</p>

      <dl className="task-meta">
        <div>
          <dt>Area</dt>
          <dd>{post.location?.label || "Any"}</dd>
        </div>
        <div>
          <dt>Skill</dt>
          <dd>{post.requiredSkills?.join(", ") || "Any"}</dd>
        </div>
        <div>
          <dt>Needed</dt>
          <dd>{post.volunteersNeeded} volunteers</dd>
        </div>
      </dl>
    </article>
  );
}