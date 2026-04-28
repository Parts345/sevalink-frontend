import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Users, AlertCircle, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// ✅ FIXED: Paths now point to your main app's folders
import { calculatePriority } from '../utils/analytics';
import StatsCard from '../components/StatsCard';
import { getDashboardStats } from '../services/api';

const AdminDashboardPage = () => {
  const [liveData, setLiveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getDashboardStats();
        setLiveData(result);
        setLoading(false);
      } catch (err) {
        console.error("API error:", err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading stats...</div>;

  // --- DYNAMIC CALCULATIONS ---
  // 1. Total Volunteers: Sum of all 'volunteers' fields in the array
  const totalVolunteers = liveData.reduce((sum, item) => sum + item.volunteers, 0);
  
  // 2. Urgent Needs: Count how many areas have more 'needs' than 'volunteers'
  const urgentCount = liveData.filter(item => item.needs > item.volunteers).length;
  
  // 3. Active Areas: Simply the number of items in your MongoDB collection
  const activeAreas = liveData.length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Dashboard</h1>
      
      {/* 1. Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={<Users className="text-blue-600" />} 
          title="Total Volunteers" 
          value={totalVolunteers} 
          color="bg-blue-50" 
        />
        <StatsCard 
          icon={<AlertCircle className="text-red-600" />} 
          title="Urgent Needs" 
          value={urgentCount} 
          color="bg-red-50" 
        />
        <StatsCard 
          icon={<CheckCircle className="text-green-600" />} 
          title="Tasks Completed" 
          value="85" 
          color="bg-green-50" 
        />
        <StatsCard 
          icon={<MapPin className="text-purple-600" />} 
          title="Active Areas" 
          value={activeAreas} 
          color="bg-purple-50" 
        />
      </div>

      {/* 2. Main Content Grid (Chart + Heatmap) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-6">Resource Gap Analysis</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="needs" fill="#ef4444" name="Requirements" radius={[4, 4, 0, 0]} />
                <Bar dataKey="volunteers" fill="#3b82f6" name="Assigned Volunteers" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Urgency Heatmap</h2>
          <div className="space-y-4">
            {liveData.map((item) => {
              const priorityInfo = calculatePriority(item.needs, item.volunteers);
              return (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.needs} pending requests</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${priorityInfo.color}`}>
                    {priorityInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/admin/insights" className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all group">
          View Smart AI Insights 
          <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;