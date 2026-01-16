import api from '../utils/api.js';
import { navigate } from '../router.js';

export const ClubFormPage = async () => {
  const container = document.createElement('div');
  container.className = 'max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100';

  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-6">Create New Club</h2>
    <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"></div>
    <form id="club-form" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
        <input type="text" name="name" class="input-field" placeholder="e.g. Robotics Club" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" rows="4" class="input-field" placeholder="Describe your club..." required></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Club Logo (Image)</label>
        <div class="mt-1 flex items-center">
            <input type="file" name="logo" accept="image/*" class="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
            "/>
        </div>
        <p class="text-xs text-gray-500 mt-1">Or leave empty to use default placeholder.</p>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button type="button" id="cancel-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
        <button type="submit" class="btn-primary">Create Club</button>
      </div>
    </form>
  `;

  const form = container.querySelector('#club-form');
  const errorDiv = container.querySelector('#error-message');
  const cancelBtn = container.querySelector('#cancel-btn');

  cancelBtn.addEventListener('click', () => {
    navigate('/clubs');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');

    const formData = new FormData(form);
    // FormData automatically sets the correct Content-Type with boundary for files.
    // We can pass the FormData object directly to axios.

    try {
      await api.post('/clubs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/clubs');
    } catch (error) {
      errorDiv.textContent = error.response?.data?.message || error.message;
      errorDiv.classList.remove('hidden');
    }
  });

  return container;
};
