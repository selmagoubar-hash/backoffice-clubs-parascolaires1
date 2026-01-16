import api from '../utils/api.js';

export const EventsPage = async () => {
    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Upcoming Events</h1>
      <button id="create-event-btn" class="btn-primary hidden" onclick="window.location.hash='#/events/create'">Create Event</button>
    </div>
    <div id="events-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="col-span-full text-center py-10 text-gray-500">Loading events...</div>
    </div>
  `;

    // Check role for create button (President or Admin)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && (user.role === 'president_club' || user.role === 'admin')) {
        container.querySelector('#create-event-btn').classList.remove('hidden');
    }

    // Fetch Events
    try {
        const { data } = await api.get('/events');
        const grid = container.querySelector('#events-grid');
        grid.innerHTML = '';

        if (data.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center text-gray-500">No events found.</div>';
        } else {
            data.forEach(event => {
                const date = new Date(event.date).toLocaleDateString();
                const card = document.createElement('div');
                card.className = 'card hover:shadow-xl transition-shadow flex flex-col';

                // Robust ID matching
                const userId = user?._id || user?.id;
                const isRegistered = event.attendees?.some(att =>
                    (typeof att === 'string' ? att : att?._id || att)?.toString() === userId?.toString()
                );

                card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded">
                        ${date}
                    </div>
                </div>
                <div class="flex-grow">
                    <h3 class="text-xl font-bold mb-2">${event.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${event.description}</p>
                </div>
                <div class="border-t pt-4 flex justify-between items-center text-sm text-gray-500">
                    <div class="flex items-center">
                        <span>📍 ${event.location}</span>
                    </div>
                    <div class="font-medium text-primary text-xs uppercase tracking-wider">
                        ${event.club?.name || 'Unknown Club'}
                    </div>
                </div>
                <button 
                    class="register-btn w-full mt-4 py-2 rounded-lg font-semibold transition-all ${isRegistered ? 'bg-green-100 text-green-700 cursor-default' : 'btn-secondary text-sm'}" 
                    data-id="${event._id}"
                    ${isRegistered ? 'disabled' : ''}
                >
                    ${isRegistered ? '✓ Registered' : 'Register Now'}
                </button>
            `;

                const registerBtn = card.querySelector('.register-btn');
                if (!isRegistered) {
                    registerBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (!user) {
                            alert('Please login to register for events');
                            return;
                        }

                        try {
                            registerBtn.disabled = true;
                            registerBtn.textContent = 'Registering...';
                            const response = await api.post(`/events/${event._id}/register`);
                            console.log('Registration success:', response.data);

                            registerBtn.textContent = '✓ Registered';
                            registerBtn.className = 'w-full mt-4 py-2 rounded-lg font-semibold bg-green-100 text-green-700 cursor-default shadow-inner';
                            registerBtn.disabled = true;
                        } catch (err) {
                            console.error('Registration failed:', err);
                            const msg = err.response?.data?.message || err.message || 'Unknown registration error';
                            alert('Registration Failed: ' + msg);
                            registerBtn.disabled = false;
                            registerBtn.textContent = 'Register Now';
                        }
                    });
                }

                grid.appendChild(card);
            });
        }

    } catch (error) {
        const grid = container.querySelector('#events-grid');
        grid.innerHTML = `
        <div class="col-span-full text-center text-red-500 bg-red-50 p-4 rounded">
            Error loading events: ${error.message}
        </div>
    `;
    }

    return container;
};
