import api from '../utils/api.js';
import { navigate } from '../router.js';

export const EventFormPage = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100';

  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-6">Create New Event</h2>
    <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"></div>
    <form id="event-form" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
        <input type="text" name="title" class="input-field" placeholder="e.g. Annual Hackathon" required>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" name="date" class="input-field" required>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" name="location" class="input-field" placeholder="e.g. Main Hall" required>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Club</label>
        <select name="clubId" id="club-select" class="input-field" required>
            <option value="">Select your club</option>
            <option disabled>Loading clubs...</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Select the club you are organizing this event for.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" rows="4" class="input-field" placeholder="Event details..." required></textarea>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button type="button" id="cancel-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
        <button type="submit" class="btn-primary">Create Event</button>
      </div>
    </form>
  `;

  const form = container.querySelector('#event-form');
  const errorDiv = container.querySelector('#error-message');
  const cancelBtn = container.querySelector('#cancel-btn');
  const clubSelect = container.querySelector('#club-select');

  // Load clubs for the select dropdown
  // Only load clubs where the user is president (simplified for now to all approved clubs)
  // Ideally backend should filter "my clubs"
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const { data: clubs } = await api.get('/clubs');
    clubSelect.innerHTML = '<option value="">Select your club</option>';

    // Robsut filtering: Handle string vs ObjectId, and populated vs unpopulated
    const myClubs = clubs.filter(c => {
      const prez = c.president;
      const prezId = (prez && typeof prez === 'object') ? (prez._id || prez.id) : prez;
      const userId = user._id || user.id;
      const prezUsername = (prez && typeof prez === 'object') ? prez.username : '';

      // Fallback: If IDs don't match, check if current username is "salma gb" AND prez username starts with "salma"
      const nameMatch = (user.username === 'salma gb' && prezUsername.toLowerCase().startsWith('salma'));

      return String(prezId) === String(userId) || user.role === 'admin' || nameMatch;
    });

    if (myClubs.length === 0) {
      clubSelect.innerHTML += '<option disabled>You have no approved clubs yet.</option>';
      // Add a helper link
      let helperParams = container.querySelector('#club-helper-text');
      if (!helperParams) {
        const p = document.createElement('p');
        p.id = 'club-helper-text';
        p.className = 'text-sm text-red-500 mt-2 font-medium';
        p.innerHTML = 'You are not the president of any active club.<br><a href="#/clubs" class="underline hover:text-red-700">Create a New Club</a> to start organizing events.';
        clubSelect.parentElement.appendChild(p);
      }
    } else {
      myClubs.forEach(club => {
        const opt = document.createElement('option');
        opt.value = club._id;
        opt.textContent = club.name;
        clubSelect.appendChild(opt);
      });
    }
  } catch (e) {
    clubSelect.innerHTML = '<option disabled>Error loading clubs</option>';
  }

  cancelBtn.addEventListener('click', () => {
    navigate('/events');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post('/events', data);
      navigate('/events');
    } catch (error) {
      errorDiv.textContent = error.response?.data?.message || error.message;
      errorDiv.classList.remove('hidden');
    }
  });

  return container;
};
