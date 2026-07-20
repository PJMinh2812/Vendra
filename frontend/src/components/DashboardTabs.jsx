import { NavLink } from 'react-router-dom';
import './DashboardTabs.css';

export default function DashboardTabs({ tabs }) {
  return (
    <nav className="dashboard-tabs">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end}
          className={({ isActive }) => 'dashboard-tabs__item' + (isActive ? ' active' : '')}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
