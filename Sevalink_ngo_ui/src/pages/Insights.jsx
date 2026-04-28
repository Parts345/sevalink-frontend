import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const urgentTasks = [
  { id: 1, area: 'Area B', need: 'Medical Help', urgency: 'Critical', suggested: 'Priya (Nurse)', score: '98%' },
  { id: 2, area: 'Area D', need: 'Food Supply', urgency: 'High', suggested: 'Rahul (Logistics)', score: '92%' },
  { id: 3, area: 'Area A', need: 'Teaching', urgency: 'Medium', suggested: 'Aman (Student)', score: '85%' },
];

const Insights = () => {
  // State to track which tasks have been approved
  const [approvedTasks, setApprovedTasks] = useState([]);

  const handleApprove = (id) => {
    // Adds the task ID to our list of approved IDs
    setApprovedTasks([...approvedTasks, id]);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <Link to="/" className="flex items-center gap-2 text-blue-600 font-medium mb-6 hover:underline">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">AI-Driven Match Insights</h2>
          <p className="text-sm text-slate-500">System suggested allocations based on skill and proximity</p>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Area & Need</th>
              <th className="p-4 font-bold">Urgency</th>
              <th className="p-4 font-bold">Suggested Volunteer</th>
              <th className="p-4 font-bold">Match Score</th>
              <th className="p-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {urgentTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-700">{task.area}</p>
                  <p className="text-xs text-slate-500">{task.need}</p>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded-md text-[10px] font-bold ${
                    task.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    <ShieldAlert size={12} /> {task.urgency}
                  </span>
                </td>
                <td className="p-4 text-sm font-medium text-slate-600">{task.suggested}</td>
                <td className="p-4">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px]">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: task.score }}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{task.score} Match</span>
                </td>
                <td className="p-4">
                  {/* Conditional Rendering: If approved, show "Assigned", else show "Approve" button */}
                  {approvedTasks.includes(task.id) ? (
                    <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-3 py-2 rounded-lg border border-green-200 w-fit">
                      <CheckCircle size={14} /> Assigned
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleApprove(task.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                      Approve Match
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Insights;