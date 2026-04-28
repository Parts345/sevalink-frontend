export function SkillPill({ active, children, onClick }) {
  return (
    <button
      className={`skill-pill ${active ? "active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
