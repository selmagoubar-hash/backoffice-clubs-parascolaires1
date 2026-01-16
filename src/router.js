import { HomePage } from './pages/HomePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ClubFormPage } from './pages/ClubFormPage.js';
import { ClubDetailsPage } from './pages/ClubDetailsPage.js';
import { BdeDashboardPage } from './pages/BdeDashboardPage.js';
import { EventsPage } from './pages/EventsPage.js';
import { EventFormPage } from './pages/EventFormPage.js';
import { MemberManagementPage } from './pages/MemberManagementPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { ClubsPage } from './pages/ClubsPage.js';

const routes = {
    '/': HomePage,
    '/login': LoginPage,
    '/register': RegisterPage,
    '/dashboard': BdeDashboardPage,
    '/clubs': ClubsPage,
    '/clubs/create': ClubFormPage,
    '/events': EventsPage,
    '/events/create': EventFormPage,
    '/members': MemberManagementPage,
    '/profile': ProfilePage,
    // Dynamic routes are handled in the router function logic
};

export const navigate = (path) => {
    window.location.hash = path;
};

const router = async () => {
    const contentDiv = document.getElementById('main-content');
    const hash = window.location.hash.slice(1) || '/';

    // Simple route matching
    let pageFunction = routes[hash];

    // Dynamic Route Matching for /clubs/:id
    if (!pageFunction && hash.startsWith('/clubs/')) {
        pageFunction = ClubDetailsPage;
    }

    pageFunction = pageFunction || (() => {
        const el = document.createElement('div');
        el.innerHTML = '<h1 class="text-2xl text-red-500">404 - Page Not Found</h1>';
        return el;
    });

    contentDiv.innerHTML = '';
    const pageContent = await pageFunction();
    contentDiv.appendChild(pageContent);
};

export const initRouter = () => {
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
};
