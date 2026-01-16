import api from '../utils/api.js';
import { navigate } from '../router.js';

export const RegisterPage = () => {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100';

  container.innerHTML = `
      <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>
      <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"></div>
      <form id="register-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="username" class="input-field" placeholder="John Doe" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" class="input-field" placeholder="john@example.com" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" class="input-field" placeholder="••••••••" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" name="confirmPassword" class="input-field" placeholder="••••••••" required>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" class="input-field">
                <option value="member">Member</option>
                <option value="president_club">Club President</option>
                <option value="bde">BDE</option>
            </select>
        </div>
        <button type="submit" class="w-full btn-primary flex justify-center items-center">
            <span id="btn-text">Sign Up</span>
            <div id="spinner" class="hidden ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account? <a href="#/login" class="text-primary hover:underline">Login</a>
      </p>
    `;

  const form = container.querySelector('#register-form');
  const errorDiv = container.querySelector('#error-message');
  const btnText = container.querySelector('#btn-text');
  const spinner = container.querySelector('#spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    spinner.classList.remove('hidden');
    btnText.textContent = 'Signing Up...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      errorDiv.textContent = 'Passwords do not match';
      errorDiv.classList.remove('hidden');
      spinner.classList.add('hidden');
      btnText.textContent = 'Sign Up';
      return;
    }

    // Remove confirmPassword before sending to API
    delete data.confirmPassword;

    try {
      const response = await api.post('/auth/register', data);

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Dispatch event for Navbar update
      window.dispatchEvent(new Event('auth-change'));

      // Redirect
      navigate('/');
    } catch (error) {
      errorDiv.textContent = error.response?.data?.message || error.message;
      errorDiv.classList.remove('hidden');
    } finally {
      spinner.classList.add('hidden');
      btnText.textContent = 'Sign Up';
    }
  });

  return container;
};
