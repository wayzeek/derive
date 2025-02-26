import { NavLink } from 'react-router-dom';

// Navigation items
const navigation = [
  { name: 'Overview', path: '/', icon: '/Overview.svg' },
  { name: 'Dashboard', path: '/dashboard', icon: '/Dashboard.svg' },
  { name: 'Submissions', path: '/submissions', icon: '/Submissions.svg' },
  { name: 'Metadata', path: '/metadata', icon: '/Metadata.svg' },
  { name: 'Royalties', path: '/royalties', icon: '/Royalties.svg' },
  { name: 'Permissions', path: '/permissions', icon: '/Permissions.svg' },
];

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-[280px] flex-col bg-derive-purple">
      {/* Main Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-full bg-white p-2">
            <img src="/favicon.svg" alt="Dérive Logo" className="h-8 w-8" />
          </div>
          <span className="text-2xl font-bold text-white">Dérive</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <img src={item.icon} alt="" className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="mt-8 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-derive-bright-red text-white">
              DA
            </div>
            <div>
              <div className="font-medium text-white">Daniel A</div>
              <div className="text-sm text-white/60">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 