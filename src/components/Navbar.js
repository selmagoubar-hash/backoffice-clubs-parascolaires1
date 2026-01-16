import { navigate } from '../router.js';

export const Navbar = () => {
  const nav = document.createElement('nav');
  // Full Width Glass Navbar
  nav.className = 'w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all duration-300';

  const render = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    nav.innerHTML = `
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <a href="#/" class="flex items-center gap-2 group">
              <img src="/favicon.jpg" alt="Logo" class="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform">
              <span class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ClubHub
              </span>
            </a>
    
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center space-x-8">
              <a href="#/clubs" class="text-gray-600 hover:text-primary transition-colors">Clubs</a>
              <a href="#/events" class="text-gray-600 hover:text-primary transition-colors">Events</a>
              
              <div class="flex items-center space-x-4" id="auth-buttons">
                ${user ? `
                    <div class="flex items-center space-x-4">
                         <a href="#/profile" class="text-gray-700 font-medium hover:text-primary">Hi, ${user.username}</a>
                        ${user.role === 'bde' || user.role === 'admin' ?
          `<a href="#/dashboard" class="text-primary hover:text-indigo-700 font-medium">Dashboard</a>` : ''
        }
                        ${user.role === 'president_club' ?
          `<a href="#/members" class="text-primary hover:text-indigo-700 font-medium">Members</a>` : ''
        }
                        <button id="logout-btn" class="text-red-500 hover:text-red-600 font-medium">Logout</button>
                    </div>
                ` : `
                    <a href="#/login" class="text-gray-600 hover:text-primary font-medium">Login</a>
                    <a href="#/register" class="btn-primary">Register</a>
                `}
              </div>
            </div>
          </div>
        </div>
      `;

    // Logout Listener
    const logoutBtn = nav.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
        navigate('/login');
      });
    }
  };

  render();

  // Listen for auth changes
  window.addEventListener('auth-change', render);

  return nav;
};
