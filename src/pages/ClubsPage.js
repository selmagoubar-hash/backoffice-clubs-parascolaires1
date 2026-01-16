import api from '../utils/api.js';

export const ClubsPage = async () => {
    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Clubs</h1>
      <button id="create-club-btn" class="btn-primary hidden" onclick="window.location.hash='#/clubs/create'">Create Club</button>
    </div>
    <div id="clubs-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="col-span-full text-center py-10 text-gray-500">Loading clubs...</div>
    </div>
  `;

    // Check role for create button
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && (user.role === 'bde' || user.role === 'admin')) {
        container.querySelector('#create-club-btn').classList.remove('hidden');
    }

    // Fetch Clubs
    try {
        // For demo purposes, if API fails we might show mock data, 
        // but here we try real API first.
        const { data } = await api.get('/clubs');
        const grid = container.querySelector('#clubs-grid');
        grid.innerHTML = '';

        if (data.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center text-gray-500">No clubs found.</div>';
        } else {
            data.forEach(club => {
                const card = document.createElement('div');
                card.className = 'card hover:-translate-y-1 transition-transform cursor-pointer';
                card.onclick = () => window.location.hash = `/clubs/${club._id}`;

                // Helper to get image URL
                const getLogoUrl = (path) => {
                    if (!path) return null;
                    if (path.startsWith('http')) return path;
                    // If backend returns absolute path or relative path, adjust
                    return 'http://127.0.0.1:5002' + path;
                };
                const logoUrl = getLogoUrl(club.logo);

                card.innerHTML = `
                <div class="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                    ${logoUrl ? `<img src="${logoUrl}" class="h-full w-full object-cover" />` : 'Logo'}
                </div>
                <h3 class="text-xl font-bold mb-2">${club.name}</h3>
                <p class="text-gray-600 line-clamp-2 mb-4">${club.description}</p>
                <div class="flex justify-between items-center text-sm">
                    <span class="px-2 py-1 rounded bg-blue-100 text-blue-800">${club.status}</span>
                    <span class="text-gray-500">Members: ${club.membersCount || 0}</span>
                </div>
            `;
                grid.appendChild(card);
            });
        }

    } catch (error) {
        const grid = container.querySelector('#clubs-grid');
        grid.innerHTML = `
        <div class="col-span-full text-center text-red-500 bg-red-50 p-4 rounded">
            Error loading clubs: ${error.message}. <br/> Ensure backend is running.
        </div>
    `;
    }

    return container;
};
