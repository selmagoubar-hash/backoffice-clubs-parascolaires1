import api from '../utils/api.js';

export const ClubDetailsPage = async () => {
    const container = document.createElement('div');
    container.className = 'bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden';

    // Get ID from URL hash logic (simple parsing)
    // Assuming hash is #/clubs/:id
    const hashParts = window.location.hash.split('/');
    const clubId = hashParts[2];

    container.innerHTML = '<div class="p-8 text-center text-gray-500">Loading club details...</div>';

    try {
        const { data: club } = await api.get(`/clubs/${clubId}`);

        const getLogoUrl = (path) => {
            if (!path) return null;
            if (path.startsWith('http')) return path;
            return 'http://127.0.0.1:5002' + path;
        };

        container.innerHTML = `
            <div class="h-48 bg-gradient-to-r from-primary to-secondary relative">
                <div class="absolute -bottom-16 left-8">
                    <div class="w-32 h-32 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center overflow-hidden">
                         ${club.logo ? `<img src="${getLogoUrl(club.logo)}" class="w-full h-full object-cover rounded-lg">` : '<span class="text-4xl">🏛️</span>'}
                    </div>
                </div>
            </div>
            <div class="pt-20 px-8 pb-8">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">${club.name}</h1>
                        <div class="flex items-center space-x-4 text-sm text-gray-600">
                            <span class="flex items-center">
                                <span class="w-2 h-2 rounded-full mr-2 ${club.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}"></span>
                                ${club.status.charAt(0).toUpperCase() + club.status.slice(1)}
                            </span>
                            <span>President: ${club.president?.username || 'Unknown'}</span>
                        </div>
                    </div>
                    <button id="join-btn" class="btn-primary">Join Club</button>
                </div>
                
                <div class="prose max-w-none text-gray-600 mb-8">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">About Us</h3>
                    <p>${club.description}</p>
                </div>

                <div class="border-t pt-8">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h3>
                    <p class="text-gray-500 italic">No events scheduled yet.</p>
                </div>
            </div>
        `;

        // Join Button Logic (NOW OUTSIDE HTML STRING)
        const joinBtn = container.querySelector('#join-btn');
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            joinBtn.onclick = async () => {
                try {
                    joinBtn.disabled = true;
                    joinBtn.textContent = 'Requesting...';
                    await api.post('/members/join', { clubId: club._id });
                    alert('Membership requested successfully!');
                    joinBtn.textContent = 'Request Sent';
                } catch (error) {
                    alert(error.response?.data?.message || 'Failed to join');
                    joinBtn.textContent = 'Join Club';
                    joinBtn.disabled = false;
                }
            };
        } else {
            joinBtn.onclick = () => window.location.hash = '/login';
        }

    } catch (error) {
        container.innerHTML = `
            <div class="p-8 text-center text-red-500">
                Error loading club: ${error.message}
            </div>
        `;
    }

    return container;
};
