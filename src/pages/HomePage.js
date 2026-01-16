export const HomePage = () => {
  const container = document.createElement('div');
  container.className = 'text-center py-12';

  const user = JSON.parse(localStorage.getItem('user'));

  container.innerHTML = `
    <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
      ${user ? `Hi, ${user.username}!` : 'Welcome to ClubHub'}
    </h1>
    <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
      The ultimate platform for managing university clubs, events, and memberships.
    </p>
    <div class="flex justify-center gap-4">
      ${user ? `
        <a href="#/clubs" class="btn-primary">Browse Clubs</a>
        <a href="#/events" class="btn-secondary bg-white text-secondary border border-secondary hover:bg-gray-50">View Events</a>
      ` : `
        <a href="#/register" class="btn-primary">Get Started</a>
        <a href="#/login" class="btn-secondary bg-white text-secondary border border-secondary hover:bg-gray-50">Log In</a>
      `}
    </div>
  `;

  return container;
};
