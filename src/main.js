import './index.css';
import { initRouter } from './router.js';
import { Navbar } from './components/Navbar.js';

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen flex flex-col bg-slate-50 relative">
    <!-- Subtle Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50 opacity-60 -z-10"></div>

    <header id="navbar-container" class="sticky top-0 z-50"></header>
    <main id="main-content" class="flex-grow container mx-auto px-4 py-8 relative z-0">
      <!-- Page Content will be injected here -->
    </main>
    <footer class="bg-white border-t border-gray-100 py-6 text-center text-gray-500 relative z-10 text-sm">
      &copy; 2026 University Club Management. All rights reserved.
    </footer>
  </div>
`;

// Initialize Navbar
const navbarContainer = document.getElementById('navbar-container');
navbarContainer.appendChild(Navbar());

// Initialize Router
initRouter();
