import api from '../utils/api.js';

export const ProfilePage = async () => {
    const container = document.createElement('div');
    container.className = 'max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100';

    container.innerHTML = '<div class="text-center text-gray-500">Loading profile...</div>';

    try {
        const { data: user } = await api.get('/auth/profile');

        if (!user) {
            throw new Error('User not found');
        }

        container.innerHTML = `
            <div class="flex items-center space-x-6 mb-8">
                <div class="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold">
                    ${user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">${user.username}</h1>
                    <p class="text-gray-500">${user.email}</p>
                    <span class="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        ${user.role}
                    </span>
                </div>
            </div>

            <div class="border-t pt-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">My Activity</h3>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600 italic">No recent activity found.</p>
                </div>
            </div>
            
            <div class="mt-8 flex justify-end">
                <button class="text-red-500 hover:text-red-600" id="logout-btn-profile">Logout</button>
            </div>
        `;

        container.querySelector('#logout-btn-profile').onclick = () => {
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth-change'));
            window.location.hash = '/login';
        };

    } catch (error) {
        container.innerHTML = `
            <div class="text-center text-red-500">
                <p class="mb-4">Failed to load profile: ${error.response?.status === 404 ? 'User account no longer exists.' : error.message}</p>
                <button id="error-logout-btn" class="btn-primary">Logout & Login Again</button>
            </div>
        `;

        setTimeout(() => {
            const btn = container.querySelector('#error-logout-btn');
            if (btn) {
                btn.onclick = () => {
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                    window.location.hash = '/login';
                }
            }
        }, 0);
    }

    return container;
};
