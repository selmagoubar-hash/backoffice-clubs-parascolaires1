import api from '../utils/api.js';
import { navigate } from '../router.js';

export const LoginPage = () => {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100';

  container.innerHTML = `
    <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
    <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"></div>
    <form id="login-form" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" class="input-field" placeholder="john@example.com" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" name="password" class="input-field" placeholder="••••••••" required>
      </div>
      <button type="submit" class="w-full btn-primary flex justify-center items-center">
            <span id="btn-text">Sign In</span>
            <div id="spinner" class="hidden ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </button>
    </form>
    <p class="mt-4 text-center text-sm text-gray-600">
      Don't have an account? <a href="#/register" class="text-primary hover:underline">Register</a>
    </p>
  `;

  const form = container.querySelector('#login-form');
  const errorDiv = container.querySelector('#error-message');
  const btnText = container.querySelector('#btn-text');
  const spinner = container.querySelector('#spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    spinner.classList.remove('hidden');
    btnText.textContent = 'Signing In...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await api.post('/auth/login', data);

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Dispatch event for Navbar update
      window.dispatchEvent(new Event('auth-change'));

      // Redirect
      navigate('/');
    } catch (error) {
      errorDiv.textContent = error.response?.data?.message || 'Login failed';
      errorDiv.classList.remove('hidden');
    } finally {
      spinner.classList.add('hidden');
      btnText.textContent = 'Sign In';
    }
  });

  return container;
};
