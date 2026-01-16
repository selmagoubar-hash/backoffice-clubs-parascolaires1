import api from '../utils/api.js';

export const MemberManagementPage = async () => {
    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
      <h1 class="text-3xl font-bold text-gray-800">Member Management</h1>
      <div id="loading" class="text-gray-500">Loading members...</div>
      <div id="clubs-members-container" class="space-y-8 hidden">
      </div>
    `;

    // Fetch members for clubs owned by this user
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        // 1. Get my clubs
        const { data: allClubs } = await api.get('/clubs');
        const myClubs = allClubs.filter(c => c.president?._id === user._id || c.president === user._id); // Simplified check

        if (myClubs.length === 0) {
            container.querySelector('#loading').textContent = 'You do not manage any clubs.';
            return container;
        }

        const membersContainer = container.querySelector('#clubs-members-container');
        membersContainer.classList.remove('hidden');
        container.querySelector('#loading').classList.add('hidden');

        for (const club of myClubs) {
            const clubSection = document.createElement('div');
            clubSection.className = 'bg-white rounded-xl shadow p-6 border border-gray-100';

            clubSection.innerHTML = `
                <h2 class="text-xl font-bold mb-4 border-b pb-2">${club.name} Members</h2>
                <div class="members-list space-y-3">
                    <div class="text-sm text-gray-400">Loading list...</div>
                </div>
            `;

            // Fetch members for this club
            try {
                const { data: members } = await api.get(`/members/club/${club._id}`);
                const list = clubSection.querySelector('.members-list');
                list.innerHTML = '';

                if (members.length === 0) {
                    list.innerHTML = '<div class="text-sm text-gray-400">No members yet.</div>';
                } else {
                    members.forEach(member => {
                        const item = document.createElement('div');
                        item.className = 'flex justify-between items-center p-3 bg-gray-50 rounded';
                        item.innerHTML = `
                            <div>
                                <div class="font-medium">${member.user.username}</div>
                                <div class="text-xs text-gray-500">${member.user.email}</div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <span class="text-xs px-2 py-1 rounded ${getStatusColor(member.status)}">${member.status}</span>
                                ${member.status === 'pending' ? `
                                    <button class="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" data-action="active" data-id="${member._id}">Approve</button>
                                    <button class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-action="rejected" data-id="${member._id}">Reject</button>
                                ` : ''}
                                ${member.status === 'active' ? `
                                    <button class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200" data-action="banned" data-id="${member._id}">Ban</button>
                                ` : ''}
                            </div>
                        `;

                        // Action listeners
                        const buttons = item.querySelectorAll('button');
                        buttons.forEach(btn => {
                            btn.onclick = async () => {
                                if (!confirm('Are you sure?')) return;
                                try {
                                    await api.put(`/members/${btn.dataset.id}/status`, { status: btn.dataset.action });
                                    // Reload specific list (lazy: reload whole page or just re-fetch this club)
                                    // For simplicity, reload page
                                    window.location.reload();
                                } catch (e) {
                                    alert(e.message);
                                }
                            };
                        });

                        list.appendChild(item);
                    });
                }

            } catch (e) {
                console.error(e);
            }

            membersContainer.appendChild(clubSection);
        }

    } catch (e) {
        container.querySelector('#loading').textContent = 'Error: ' + e.message;
    }

    return container;
};

const getStatusColor = (status) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
