import api from '../utils/api.js';

export const BdeDashboardPage = async () => {
    const container = document.createElement('div');
    container.className = 'space-y-8';

    container.innerHTML = `
      <h1 class="text-3xl font-bold text-gray-800">BDE Dashboard</h1>
      
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 class="text-xl font-bold mb-4">Pending Club Requests</h2>
          <div id="pending-clubs" class="space-y-4">
              <div class="text-center text-gray-500">Loading requests...</div>
          </div>
      </div>
    `;

    const loadPendingClubs = async () => {
        try {
            const { data } = await api.get('/clubs');
            // Filter locally for now, ideally API should filter
            const pendingClubs = data.filter(c => c.status === 'pending');
            const pendingContainer = container.querySelector('#pending-clubs');

            if (pendingClubs.length === 0) {
                pendingContainer.innerHTML = '<div class="text-center text-gray-400">No pending requests</div>';
                return;
            }

            pendingContainer.innerHTML = '';
            pendingClubs.forEach(club => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50';
                item.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                            ${club.logo ? `<img src="${club.logo}" class="w-full h-full rounded-full object-cover">` : 'test'}
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">${club.name}</h3>
                            <p class="text-sm text-gray-600">President: ${club.president?.username || 'Unknown'}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors" data-action="approve" data-id="${club._id}">Approve</button>
                        <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" data-action="reject" data-id="${club._id}">Reject</button>
                    </div>
                `;

                // Add event listeners (using delegation would be better but this is fine)
                item.querySelector('[data-action="approve"]').onclick = () => handleStatus(club._id, 'approved');
                item.querySelector('[data-action="reject"]').onclick = () => handleStatus(club._id, 'rejected');

                pendingContainer.appendChild(item);
            });

        } catch (error) {
            container.querySelector('#pending-clubs').innerHTML = `<div class="text-red-500">Error: ${error.message}</div>`;
        }
    };

    const handleStatus = async (id, status) => {
        try {
            if (!confirm(`Are you sure you want to ${status} this club?`)) return;
            await api.put(`/clubs/${id}/status`, { status });
            // Refresh list
            loadPendingClubs();
        } catch (error) {
            alert('Failed to update status: ' + (error.response?.data?.message || error.message));
        }
    };

    loadPendingClubs();

    return container;
};
