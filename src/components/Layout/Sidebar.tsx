import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  CalendarClock,
  Wallet,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/home', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assigned', icon: ClipboardList, label: 'Assigned Exams' },
  { to: '/conducted', icon: CheckCircle2, label: 'Conducted Exams' },
  { to: '/upcoming', icon: CalendarClock, label: 'Upcoming Exams' },
  { to: '/payments', icon: Wallet, label: 'Payments' },
  { to: '/incidents', icon: AlertTriangle, label: 'Incidents' },
  { to: '/applications', icon: FileText, label: 'Applications' },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`
        relative flex flex-col glass border-r border-slate-700/50
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700/40">
        <div className="gradient-brand rounded-xl p-2 shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-slate-100 text-sm leading-tight truncate">ExamDuty</p>
            <p className="text-xs text-slate-400 truncate">Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'gradient-brand text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {user && (
        <div className="p-3 border-t border-slate-700/40">
          {!collapsed ? (
            <div className="glass-light rounded-xl p-3 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.employeeId}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 glass border border-slate-700/60 rounded-full p-1 text-slate-400 hover:text-slate-100 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
