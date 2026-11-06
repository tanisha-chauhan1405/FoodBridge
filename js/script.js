(() => {
  'use strict';

  const STORE = {
    users: 'foodbridge_users_v2',
    donations: 'foodbridge_donations_v2',
    requests: 'foodbridge_requests_v2',
    session: 'foodbridge_session_v2'
  };

  const images = {
    meal: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',
    biryani: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=900&q=82',
    bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82',
    rice: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=82',
    fruit: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=82',
    sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=82',
    curry: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=82',
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82',
    bakery: 'https://images.unsplash.com/photo-1608198093002-ad4e005484df?auto=format&fit=crop&w=900&q=82'
  };

  const categoryImages = {
    'Prepared meals': images.meal,
    'Bakery': images.bread,
    'Fruits & vegetables': images.fruit,
    'Rice & grains': images.rice,
    'Dairy': images.salad,
    'Other': images.curry
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const publicSite = $('#publicSite');
  const authScreen = $('#authScreen');
  const appShell = $('#appShell');
  const appView = $('#appView');
  const modalBackdrop = $('#modalBackdrop');
  const modalContent = $('#modalContent');
  let currentView = 'dashboard';
  let browseSearch = '';
  let activeFilter = 'All food';
  let toastTimer = null;

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn(`Could not read ${key} from localStorage`, error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Could not save ${key}`, error);
      toast('Your browser could not save this change. Check available storage.', 'error');
      return false;
    }
  }

  function uid(prefix = 'fb') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function localDateTime(hoursFromNow = 0) {
    const date = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function seedData() {
    const users = read(STORE.users, null);
    if (!users || !users.length) {
      write(STORE.users, [
        { id: 'demo-donor', name: 'Aarav Mehta', organization: 'Harvest Table Kitchen', email: 'donor@foodbridge.demo', password: 'demo123', phone: '9876543210', city: 'Noida', role: 'donor', createdAt: new Date().toISOString() },
        { id: 'demo-receiver', name: 'Ananya Sharma', organization: 'Udaan Community Centre', email: 'ngo@foodbridge.demo', password: 'demo123', phone: '9876501234', city: 'Noida', role: 'receiver', createdAt: new Date().toISOString() },
        { id: 'demo-donor-2', name: 'Ritika Verma', organization: 'Daily Crust Bakery', email: 'bakery@foodbridge.demo', password: 'demo123', phone: '9876512345', city: 'Ghaziabad', role: 'donor', createdAt: new Date().toISOString() }
      ]);
    }

    if (!read(STORE.donations, null)?.length) {
      const seededAt = new Date().toISOString();
      write(STORE.donations, [
        { id: 'food-101', donorId: 'demo-donor', donorName: 'Aarav Mehta', donorOrg: 'Harvest Table Kitchen', title: 'Vegetable biryani boxes', category: 'Prepared meals', quantity: 24, unit: 'plates', servings: 24, pickupAddress: 'Sector 18 Market, Noida', city: 'Noida', pickupFrom: localDateTime(0.5), pickupUntil: localDateTime(3), description: 'Freshly prepared vegetable biryani packed in individual food-grade containers. Contains rice, mixed vegetables and mild spices.', image: images.biryani, status: 'available', createdAt: seededAt },
        { id: 'food-102', donorId: 'demo-donor-2', donorName: 'Ritika Verma', donorOrg: 'Daily Crust Bakery', title: 'Assorted bread & buns', category: 'Bakery', quantity: 18, unit: 'packets', servings: 18, pickupAddress: 'Vaishali Sector 4, Ghaziabad', city: 'Ghaziabad', pickupFrom: localDateTime(1), pickupUntil: localDateTime(5), description: 'A mix of fresh whole-wheat loaves, dinner rolls and buns from today’s bakery batch.', image: images.bread, status: 'available', createdAt: seededAt },
        { id: 'food-103', donorId: 'demo-donor', donorName: 'Aarav Mehta', donorOrg: 'Harvest Table Kitchen', title: 'Rice & dal lunch combo', category: 'Rice & grains', quantity: 12, unit: 'kg', servings: 30, pickupAddress: 'Sector 62, Noida', city: 'Noida', pickupFrom: localDateTime(0.25), pickupUntil: localDateTime(2.5), description: 'A simple, nourishing lunch combo packed separately. Please bring reusable crates for collection.', image: images.rice, status: 'available', createdAt: seededAt },
        { id: 'food-104', donorId: 'demo-donor-2', donorName: 'Ritika Verma', donorOrg: 'Daily Crust Bakery', title: 'Seasonal fruit baskets', category: 'Fruits & vegetables', quantity: 9, unit: 'kg', servings: 18, pickupAddress: 'Indirapuram Habitat Centre, Ghaziabad', city: 'Ghaziabad', pickupFrom: localDateTime(1.5), pickupUntil: localDateTime(6), description: 'A selection of ripe bananas, apples, oranges and seasonal fruit. Please inspect before distribution.', image: images.fruit, status: 'available', createdAt: seededAt },
        { id: 'food-105', donorId: 'demo-donor', donorName: 'Aarav Mehta', donorOrg: 'Harvest Table Kitchen', title: 'Fresh sandwich platter', category: 'Prepared meals', quantity: 30, unit: 'pieces', servings: 30, pickupAddress: 'Sector 50, Noida', city: 'Noida', pickupFrom: localDateTime(2), pickupUntil: localDateTime(5), description: 'Vegetarian sandwiches with cucumber, tomato and cheese. Kept chilled; collect in an insulated bag.', image: images.sandwich, status: 'available', createdAt: seededAt },
        { id: 'food-106', donorId: 'demo-donor-2', donorName: 'Ritika Verma', donorOrg: 'Daily Crust Bakery', title: 'Vegetable curry & rice trays', category: 'Prepared meals', quantity: 20, unit: 'servings', servings: 20, pickupAddress: 'Crossings Republik, Ghaziabad', city: 'Ghaziabad', pickupFrom: localDateTime(0.75), pickupUntil: localDateTime(4), description: 'Mild mixed-vegetable curry with steamed rice in sealed meal trays.', image: images.curry, status: 'available', createdAt: seededAt }
      ]);
    }
    if (!read(STORE.requests, null)) write(STORE.requests, []);
  }

  function getUsers() { return read(STORE.users, []); }
  function getDonations() { return read(STORE.donations, []); }
  function getRequests() { return read(STORE.requests, []); }
  function saveDonations(value) { return write(STORE.donations, value); }
  function saveRequests(value) { return write(STORE.requests, value); }
  function getCurrentUser() {
    const session = read(STORE.session, null);
    return session ? getUsers().find(user => user.id === session.userId) || null : null;
  }
  function isDonor(user = getCurrentUser()) { return user?.role === 'donor'; }
  function isReceiver(user = getCurrentUser()) { return user?.role === 'receiver'; }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function contactCard(person, heading) {
    const phone = String(person.phone || '').trim();
    const email = String(person.email || '').trim();

    const safePhone = phone.replace(/[^\d+]/g, '');

    if (!phone && !email) return '';

    return `
        <div class="request-contact">
            <strong>${escapeHtml(heading)}</strong>

            <div class="request-contact-links">

                ${phone ? `
                    <a href="tel:${escapeHtml(safePhone)}">
                        ☎ ${escapeHtml(phone)}
                    </a>
                ` : ''}

                ${email ? `
                    <a href="mailto:${escapeHtml(email)}">
                        ✉ ${escapeHtml(email)}
                    </a>
                ` : ''}

            </div>
        </div>
    `;
}
  function initials(name = 'User') {
    return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'U';
  }
  function niceDate(value, includeTime = false) {
    if (!value) return 'Not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return date.toLocaleString('en-IN', includeTime ? { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' } : { day: 'numeric', month: 'short' });
  }
  function relativeDate(value) {
    if (!value) return '';
    const diff = new Date(value).getTime() - Date.now();
    if (Number.isNaN(diff)) return '';
    if (diff < 0) return 'Pickup window passed';
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours < 1) return `${Math.max(mins, 1)} min left`;
    if (hours < 24) return `${hours}h ${mins}m left`;
    return `${Math.floor(hours / 24)}d left`;
  }
  function imageFor(item) { return item.image || categoryImages[item.category] || images.meal; }
  function statusLabel(status) {
    const labels = { available: 'Available', requested: 'Request received', claimed: 'Confirmed', collected: 'Collected', cancelled: 'Cancelled', pending: 'Pending', approved: 'Approved', rejected: 'Declined', completed: 'Completed' };
    return labels[status] || status;
  }
  function statusClass(status) { return ['requested', 'claimed', 'collected', 'cancelled', 'pending', 'approved', 'rejected', 'completed'].includes(status) ? status : 'available'; }
  function toast(message, type = 'success') {
    const region = $('#toastRegion');
    if (!region) return;
    const node = document.createElement('div');
    node.className = `toast ${type === 'error' ? 'error' : type === 'warning' ? 'warning' : ''}`;
    node.innerHTML = `<strong>${type === 'error' ? '!' : type === 'warning' ? '•' : '✓'}</strong>${escapeHtml(message)}`;
    region.appendChild(node);
    setTimeout(() => node.remove(), 3400);
  }

  function showPublic() {
    publicSite.classList.remove('hidden');
    authScreen.classList.add('hidden');
    appShell.classList.add('hidden');
    closeModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function showAuth(mode = 'login', selectedRole = '') {
    publicSite.classList.add('hidden');
    appShell.classList.add('hidden');
    authScreen.classList.remove('hidden');
    $('#loginFormWrap').classList.toggle('hidden', mode !== 'login');
    $('#signupFormWrap').classList.toggle('hidden', mode !== 'signup');
    if (selectedRole) $('#signupRole').value = selectedRole;
    closeModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function showApp(view = 'dashboard') {
    const user = getCurrentUser();
    if (!user) return showAuth('login');
    publicSite.classList.add('hidden');
    authScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
    $('#topAvatar').textContent = initials(user.name);
    $('#topUserName').textContent = user.name.split(' ')[0];
    $('#todayLabel').textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    renderNavigation();
    const pendingCount = getRequests().filter(request => isDonor(user) ? request.donorId === user.id && request.status === 'pending' : request.requesterId === user.id && ['pending', 'approved'].includes(request.status)).length;
    $('#notificationDot').style.display = pendingCount ? 'block' : 'none';
    renderView(view);
    closeMobileSidebar();
  }

  function navItems(user) {
    const pending = getRequests().filter(request => isDonor(user) ? request.donorId === user.id && request.status === 'pending' : request.requesterId === user.id && ['pending', 'approved'].includes(request.status)).length;
    const common = [{ id: 'dashboard', label: 'Overview', icon: '⌂' }];
    if (isDonor(user)) {
      common.push({ id: 'post', label: 'Post surplus food', icon: '＋' }, { id: 'listings', label: 'My listings', icon: '▤' }, { id: 'requests', label: 'Incoming requests', icon: '♧', count: pending });
    } else {
      common.push({ id: 'browse', label: 'Browse available food', icon: '⌕' }, { id: 'myrequests', label: 'My requests', icon: '▤', count: pending });
    }
    common.push({ id: 'activity', label: 'Activity', icon: '◷' }, { id: 'profile', label: 'My profile', icon: '○' });
    return common;
  }
  function renderNavigation() {
    const user = getCurrentUser();
    if (!user) return;
    $('#sideNav').innerHTML = navItems(user).map(item => `<button type="button" class="${currentView === item.id ? 'active' : ''}" data-action="navigate" data-view="${item.id}"><span class="nav-icon">${item.icon}</span><span>${item.label}</span>${item.count ? `<span class="nav-count">${item.count}</span>` : ''}</button>`).join('');
  }
  function viewTitle(view) {
    return ({ dashboard: 'Overview', post: 'Post surplus food', listings: 'My listings', requests: 'Incoming requests', browse: 'Food board', myrequests: 'My requests', activity: 'Activity', profile: 'My profile' })[view] || 'Overview';
  }
  function renderView(view) {
    const user = getCurrentUser();
    if (!user) return showAuth('login');
    currentView = view;
    const allowed = navItems(user).some(item => item.id === view);
    if (!allowed) currentView = 'dashboard';
    $('#breadcrumbLabel').textContent = viewTitle(currentView);
    renderNavigation();
    const renderers = {
      dashboard: renderDashboard,
      post: renderPostForm,
      listings: renderMyListings,
      requests: renderIncomingRequests,
      browse: renderBrowse,
      myrequests: renderMyRequests,
      activity: renderActivity,
      profile: renderProfile
    };
    appView.innerHTML = renderers[currentView]();
    appView.focus({ preventScroll: true });
  }

  function pageHeading(eyebrow, title, description, actions = '') {
    return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>${actions ? `<div class="page-heading-actions">${actions}</div>` : ''}</div>`;
  }
  function metric(label, value, note, icon) {
    return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div><strong class="metric-value">${value}</strong><div class="metric-note">${note}</div></article>`;
  }
  function renderDashboard() {
    const user = getCurrentUser();
    const all = getDonations();
    const requests = getRequests();
    const ownDonations = all.filter(item => item.donorId === user.id);
    const ownRequests = requests.filter(item => isDonor(user) ? item.donorId === user.id : item.requesterId === user.id);
    const pending = ownRequests.filter(item => item.status === 'pending').length;
    const completed = ownRequests.filter(item => item.status === 'completed').length;
    const sharedMeals = ownDonations.filter(item => ['claimed', 'collected'].includes(item.status)).reduce((total, item) => total + Number(item.servings || 0), 0);
    const requestedMeals = ownRequests.filter(item => ['approved', 'completed'].includes(item.status)).reduce((total, item) => total + Number(item.servings || 0), 0);
    const title = isDonor(user) ? 'Your generosity is going places.' : 'There is good food out there.';
    const subtitle = isDonor(user) ? 'Every listing is a chance to turn surplus into something meaningful.' : 'Find nearby surplus food and help it reach the people who need it.';
    const metrics = isDonor(user)
      ? metric('Active listings', ownDonations.filter(item => ['available', 'requested'].includes(item.status)).length, 'Food currently on your board', '▤') + metric('Meals shared', sharedMeals, 'Servings in confirmed pickups', '♡') + metric('Pending requests', pending, 'Waiting for your response', '♧') + metric('Completed listings', ownDonations.filter(item => item.status === 'collected').length, 'Successful hand-offs', '✓')
      : metric('Available listings', all.filter(item => item.status === 'available').length, 'Food open for requests', '⌕') + metric('My requests', ownRequests.length, 'Requests you have placed', '▤') + metric('Meals arranged', requestedMeals, 'Servings in confirmed pickups', '♡') + metric('Completed pickups', completed, 'Successful collections', '✓');

    const recentRows = isDonor(user)
      ? ownDonations.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(item => `<tr><td><div class="table-food"><img src="${escapeHtml(imageFor(item))}" alt=""><span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.category)}</small></span></div></td><td>${Number(item.servings || 0)} servings</td><td><span class="status-pill ${statusClass(item.status)}">${statusLabel(item.status)}</span></td><td><button class="row-action" data-action="food-detail" data-id="${item.id}">View</button></td></tr>`).join('')
      : ownRequests.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(request => { const item = all.find(food => food.id === request.donationId); return item ? `<tr><td><div class="table-food"><img src="${escapeHtml(imageFor(item))}" alt=""><span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.donorOrg || item.donorName)}</small></span></div></td><td>${Number(item.servings || 0)} servings</td><td><span class="status-pill ${statusClass(request.status)}">${statusLabel(request.status)}</span></td><td><button class="row-action" data-action="food-detail" data-id="${item.id}">View</button></td></tr>` : ''; }).join('');

    return `${pageHeading('YOUR FOODBRIDGE SPACE', 'Hello, ' + escapeHtml(user.name.split(' ')[0]) + ' 👋', 'Here is a little snapshot of the good happening through your account.', isDonor(user) ? '<button class="btn btn-primary" data-action="navigate" data-view="post">＋ Post food</button>' : '<button class="btn btn-primary" data-action="navigate" data-view="browse">Explore food ↗</button>')}
      <section class="dashboard-welcome"><div class="welcome-copy"><span>YOUR COMMUNITY, YOUR IMPACT</span><h2>${title}</h2><p>${subtitle} <em>Keep it going.</em></p></div><button class="btn btn-dark welcome-cta" data-action="navigate" data-view="${isDonor(user) ? 'post' : 'browse'}">${isDonor(user) ? 'Add a food listing' : 'Find available food'} <span>↗</span></button></section>
      <section class="metric-grid">${metrics}</section>
      <section class="dashboard-grid"><div class="panel"><div class="panel-header"><div><h3>${isDonor(user) ? 'Your latest food listings' : 'Your latest requests'}</h3><p>A quick look at your recent activity</p></div><button class="panel-link" data-action="navigate" data-view="${isDonor(user) ? 'listings' : 'myrequests'}">View all ↗</button></div>
        ${recentRows ? `<div class="table-scroll"><table class="listing-table"><thead><tr><th>Food item</th><th>Quantity</th><th>Status</th><th></th></tr></thead><tbody>${recentRows}</tbody></table></div>` : `<div class="empty-state"><div class="empty-icon">♡</div><h3>Your story starts here</h3><p>${isDonor(user) ? 'Post your first surplus food listing and help someone nearby.' : 'Browse the food board and request a pickup when something fits your needs.'}</p><button class="btn btn-primary" data-action="navigate" data-view="${isDonor(user) ? 'post' : 'browse'}">${isDonor(user) ? 'Post food' : 'Browse food'}</button></div>`}</div>
        <div class="panel impact-card"><div class="panel-header"><div><h3>Your impact snapshot</h3><p>Good things add up</p></div><span>✳</span></div><div class="impact-big">${isDonor(user) ? sharedMeals : requestedMeals}</div><div class="impact-caption">meals connected through your account</div><div class="impact-progress-label"><span>Community goal</span><b>${Math.min(100, Math.round((isDonor(user) ? sharedMeals : requestedMeals) / 100 * 100))}%</b></div><div class="impact-progress"><span style="width:${Math.min(100, Math.max(8, (isDonor(user) ? sharedMeals : requestedMeals)))}%"></span></div><div class="impact-foot">A small contribution can make someone's day.</div></div></section>
      <section class="quick-actions">${isDonor(user) ? `<button class="quick-action" data-action="navigate" data-view="post"><span>＋</span><b>Post surplus food</b><small>Share a new listing</small></button><button class="quick-action" data-action="navigate" data-view="requests"><span>♧</span><b>Review requests</b><small>${pending} awaiting response</small></button><button class="quick-action" data-action="navigate" data-view="listings"><span>▤</span><b>Manage my listings</b>View and Update your food posts</small></button>` : `<button class="quick-action" data-action="navigate" data-view="browse"><span>⌕</span><b>Browse available food</b><small>Find a nearby listing</small></button><button class="quick-action" data-action="navigate" data-view="myrequests"><span>▤</span><b>Track my requests</b><small>${ownRequests.length} total requests</small></button><button class="quick-action" data-action="navigate" data-view="profile"><span>○</span><b>Update organisation</b><small>Keep your details current</small></button>`}</section>`;
  }

  function renderPostForm() {
    const user = getCurrentUser();
    return `${pageHeading('SHARE SOMETHING GOOD', 'Post surplus food', 'Add a clear listing so a nearby organisation can arrange a safe, timely pickup.')}
      <div class="content-layout"><section class="form-panel"><h3>Food listing details</h3><p>Fields marked with * are required. Be accurate about quantity and pickup timing.</p>
        <form id="postFoodForm" class="app-form">
          <label class="span-2">Food name *<input name="title" required maxlength="70" placeholder="e.g. Fresh vegetable pulao boxes"></label>
          <label>Food category *<select name="category" required><option value="">Choose a category</option><option>Prepared meals</option><option>Bakery</option><option>Fruits & vegetables</option><option>Rice & grains</option><option>Dairy</option><option>Other</option></select></label>
          <label>Quantity *<input type="number" name="quantity" required min="1" max="10000" placeholder="e.g. 20"></label>
          <label>Quantity unit *<select name="unit" required><option value="plates">Plates</option><option value="packets">Packets</option><option value="kg">Kilograms (kg)</option><option value="pieces">Pieces</option><option value="servings">Servings</option><option value="boxes">Boxes</option></select></label>
          <label>Estimated servings *<input type="number" name="servings" required min="1" max="10000" placeholder="e.g. 20"></label>
          <label>Pickup available from *<input type="datetime-local" name="pickupFrom" min="${localDateTime(0)}" value="${localDateTime(0.5)}" required></label>
          <label>Pickup deadline *<input type="datetime-local" name="pickupUntil" min="${localDateTime(0.5)}" value="${localDateTime(3)}" required></label>
          <label class="span-2">Pickup address *<input name="pickupAddress" required maxlength="140" placeholder="Building, street, sector or landmark"></label>
          <label>City *<input name="city" required maxlength="50" value="${escapeHtml(user.city || '')}" placeholder="Your city"></label>
          <div class="food-upload-field span-2">
            <label for="foodImageFile">Food photo * <span class="upload-hint">Upload a clear photo of the actual food (JPG, PNG or WebP)</span></label>
            <label class="food-image-uploader" for="foodImageFile" id="foodImageDropzone">
              <img id="foodImagePreview" class="food-image-preview" alt="Selected food preview" hidden>
              <span class="food-upload-placeholder" id="foodImagePlaceholder"><strong>＋ Add food photo</strong><small>Click to choose an image from your device · Max 8 MB</small></span>
            </label>
            <input id="foodImageFile" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" required class="visually-hidden-file">
            <small class="upload-hint" id="foodImageStatus">A real photo helps NGOs identify the food before requesting pickup.</small>
          </div>
          <label class="span-2">Food notes *<textarea name="description" required maxlength="500" placeholder="Mention packing, ingredients, allergens or collection instructions..."></textarea></label>
          <div class="form-actions"><button type="button" class="btn btn-secondary" data-action="navigate" data-view="dashboard">Cancel</button><button type="submit" class="btn btn-primary">Publish listing ↗</button></div>
        </form>
      </section><aside class="hint-card"><h3>A good listing helps good food travel.</h3><p>Make it easy for community organisations to decide whether they can collect and distribute your food safely.</p><ul class="hint-list"><li><span>✓</span> Share realistic quantities and servings.</li><li><span>✓</span> Add the complete pickup address.</li><li><span>✓</span> Set a clear pickup deadline.</li><li><span>✓</span> Mention allergens and storage details.</li><li><span>✓</span> Only list food that is safe to consume.</li></ul></aside></div>`;
  }

  function foodCard(item, options = {}) {
    const user = getCurrentUser();
    const isOwn = item.donorId === user?.id;
    const status = item.status || 'available';
    const button = options.button || (isReceiver(user) && status === 'available' ? `<button class="btn btn-primary" data-action="food-detail" data-id="${item.id}">View & request</button>` : `<button class="btn btn-secondary" data-action="food-detail" data-id="${item.id}">View details</button>`);
    return `<article class="food-card"><div class="food-card-image"><img src="${escapeHtml(imageFor(item))}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='${images.meal}'"><span class="food-status status-pill ${statusClass(status)}">${statusLabel(status)}</span></div><div class="food-card-body"><div class="food-card-topline"><h3>${escapeHtml(item.title)}</h3><span class="food-category">${escapeHtml(item.category)}</span></div><div class="food-details"><span>♙ ${Number(item.servings || 0)} servings</span><span>⌖ ${escapeHtml(item.city || 'Location not set')}</span><span>◷ ${escapeHtml(relativeDate(item.pickupUntil))}</span></div><p class="food-description">${escapeHtml(item.description || 'No additional notes provided.').slice(0, 112)}${(item.description || '').length > 112 ? '…' : ''}</p><div class="food-donor"><span>By <b>${escapeHtml(item.donorOrg || item.donorName || 'Community donor')}</b></span>${button}</div></div></article>`;
  }

  function renderBrowse() {
    const user = getCurrentUser();
    const all = getDonations().filter(item => item.status === 'available' && item.donorId !== user.id);
    const filtered = all.filter(item => {
      const search = browseSearch.trim().toLowerCase();
      const matchesSearch = !search || [item.title, item.category, item.city, item.pickupAddress, item.donorOrg, item.description].join(' ').toLowerCase().includes(search);
      const matchesFilter = activeFilter === 'All food' || item.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
    const categories = ['All food', 'Prepared meals', 'Bakery', 'Fruits & vegetables', 'Rice & grains', 'Dairy'];
    return `${pageHeading('THE COMMUNITY FOOD BOARD', 'Browse available food', 'Discover surplus food shared by local donors and request a pickup that works for your organisation.', '<button class="btn btn-secondary" data-action="refresh-food">↻ Refresh</button>')}
      <div class="toolbar"><div class="filter-tabs">${categories.map(category => `<button class="filter-tab ${activeFilter === category ? 'active' : ''}" data-action="filter-food" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('')}</div><label class="toolbar-search"><span>⌕</span><input id="browseSearch" type="search" value="${escapeHtml(browseSearch)}" placeholder="Search food or city..."></label></div>
      <div class="food-grid">${filtered.length ? filtered.map(item => foodCard(item)).join('') : `<div class="empty-state"><div class="empty-icon">⌕</div><h3>No food found just yet</h3><p>Try a different search or category. New listings appear here when donors share them.</p><button class="btn btn-secondary" data-action="clear-filters">Clear filters</button></div>`}</div>`;
  }

  function renderMyListings() {
    const user = getCurrentUser();
    const items = getDonations().filter(item => item.donorId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const available = items.filter(item => item.status === 'available').length;
    return `${pageHeading('YOUR SHARED FOOD', 'My listings', `${items.length} total listing${items.length === 1 ? '' : 's'} · ${available} currently available`, '<button class="btn btn-primary" data-action="navigate" data-view="post">＋ Post new food</button>')}
      ${items.length ? `<div class="food-grid">${items.map(item => foodCard(item, { button: `${item.status === 'available' ? `<button class="btn btn-secondary" data-action="cancel-listing" data-id="${item.id}">Close listing</button>` : ''}<button class="btn btn-primary" data-action="food-detail" data-id="${item.id}">View</button>` })).join('')}</div>` : `<div class="empty-state"><div class="empty-icon">＋</div><h3>No listings yet</h3><p>Share your first surplus food listing and connect with a nearby organisation.</p><button class="btn btn-primary" data-action="navigate" data-view="post">Post your first listing</button></div>`}`;
  }

  function renderIncomingRequests() {
    const user = getCurrentUser();
    const requests = getRequests().filter(request => request.donorId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const donations = getDonations();
    const cards = requests.map(request => {
      const food = donations.find(item => item.id === request.donationId);
      if (!food) return '';
      const requester = getUsers().find(
    person => person.id === request.requesterId
);

const contact = requester &&
    ['pending', 'approved', 'completed'].includes(request.status)
    ? contactCard(requester, 'NGO Contact Information')
    : '';
      const buttons = request.status === 'pending' ? `<div class="request-actions"><button class="btn btn-primary" data-action="approve-request" data-id="${request.id}">Accept pickup</button><button class="btn btn-danger" data-action="decline-request" data-id="${request.id}">Decline</button></div>` : `<div class="request-actions"><span class="status-pill ${statusClass(request.status)}">${statusLabel(request.status)}</span></div>`;
      return `<article class="request-item"><img src="${escapeHtml(imageFor(food))}" alt=""><div class="request-info"><h3>${escapeHtml(food.title)}</h3><p><b>${escapeHtml(request.requesterOrg || request.requesterName)}</b> · ${Number(food.servings || 0)} servings · ${niceDate(request.createdAt, true)}</p><p>${escapeHtml(request.message || 'No additional message.')}</p></div>${buttons}${contact}</article>`;
    }).join('');
    return `${pageHeading('COORDINATE A HAND-OFF', 'Incoming requests', 'Review pickup requests from organisations and confirm the best match.', `<span class="status-pill pending">${requests.filter(item => item.status === 'pending').length} pending</span>`)}
      <div class="request-list">${cards || `<div class="empty-state"><div class="empty-icon">♧</div><h3>No requests yet</h3><p>When an organisation requests one of your listings, it will appear here.</p></div>`}</div>`;
  }

  function renderMyRequests() {
    const user = getCurrentUser();
    const requests = getRequests().filter(request => request.requesterId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const donations = getDonations();
    const cards = requests.map(request => {
      const food = donations.find(item => item.id === request.donationId);
      if (!food) return '';
      const donor = getUsers().find(
    person => person.id === request.donorId
);

const contact = donor &&
    ['pending', 'approved', 'completed'].includes(request.status)
    ? contactCard(donor, 'Food Donor Contact Information')
    : '';
      const action = request.status === 'approved' ? `<div class="request-actions"><button class="btn btn-primary" data-action="mark-collected" data-id="${request.id}">Mark as collected</button></div>` : `<div class="request-actions"><span class="status-pill ${statusClass(request.status)}">${statusLabel(request.status)}</span></div>`;
      return `<article class="request-item"><img src="${escapeHtml(imageFor(food))}" alt=""><div class="request-info"><h3>${escapeHtml(food.title)}</h3><p>Donor: <b>${escapeHtml(food.donorOrg || food.donorName)}</b> · ${escapeHtml(food.city)}</p><p>Pickup: ${niceDate(food.pickupFrom, true)} – ${niceDate(food.pickupUntil, true)}</p></div>${action}${contact}</article>`;
    }).join('');
    return `${pageHeading('YOUR PICKUP JOURNEY', 'My requests', 'Track the food you have requested and complete the hand-off when collected.', `<button class="btn btn-primary" data-action="navigate" data-view="browse">＋ Find food</button>`)}
      <div class="request-list">${cards || `<div class="empty-state"><div class="empty-icon">♡</div><h3>Nothing requested yet</h3><p>Browse available food and send a pickup request to a donor.</p><button class="btn btn-primary" data-action="navigate" data-view="browse">Browse available food</button></div>`}</div>`;
  }

  function renderActivity() {
    const user = getCurrentUser();
    const requests = getRequests().filter(request => isDonor(user) ? request.donorId === user.id : request.requesterId === user.id);
    const donations = getDonations().filter(item => item.donorId === user.id);
    const events = [
      ...requests.map(request => ({ date: request.updatedAt || request.createdAt, title: request.status === 'pending' ? (isDonor(user) ? 'A pickup request arrived' : 'You requested a pickup') : `Pickup ${statusLabel(request.status).toLowerCase()}`, detail: `${request.requesterOrg || request.requesterName} · ${request.donorOrg || request.donorName}`, icon: '♧' })),
      ...donations.map(item => ({ date: item.createdAt, title: 'Food listing published', detail: `${item.title} · ${Number(item.servings || 0)} servings`, icon: '＋' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    return `${pageHeading('YOUR COMMUNITY FOOTPRINT', 'Activity', 'A timeline of the listings and pickup coordination connected to your account.')}
      <div class="panel"><div class="panel-header"><div><h3>Recent activity</h3><p>Your FoodBridge story, one step at a time</p></div></div>${events.length ? `<div class="activity-timeline">${events.map(event => `<div class="activity-row"><span class="activity-dot"></span><h4>${escapeHtml(event.title)}</h4><p>${escapeHtml(event.detail || '')}</p><time>${niceDate(event.date, true)}</time></div>`).join('')}</div>` : `<div class="empty-state"><div class="empty-icon">◷</div><h3>No activity to show</h3><p>Your new listings and pickup updates will appear here.</p></div>`}</div>`;
  }

  function renderProfile() {
    const user = getCurrentUser();
    const all = getDonations();
    const count = isDonor(user) ? all.filter(item => item.donorId === user.id).length : getRequests().filter(item => item.requesterId === user.id).length;
    return `${pageHeading('YOUR ACCOUNT', 'My profile', 'Keep your contact and organisation details up to date.')}
      <div class="profile-layout"><aside class="profile-summary"><div class="profile-large-avatar">${initials(user.name)}</div><h3>${escapeHtml(user.name)}</h3><p>${escapeHtml(user.organization || 'Community member')}</p><span class="profile-role">${isDonor(user) ? 'FOOD DONOR' : 'COMMUNITY ORGANISATION'}</span><div class="profile-statline"><div><strong>${count}</strong><small>${isDonor(user) ? 'Listings' : 'Requests'}</small></div><div><strong>${escapeHtml(user.city || '—')}</strong><small>City</small></div></div></aside>
      <section class="form-panel"><h3>Personal & organisation details</h3><p>These details help other members coordinate with you.</p><form id="profileForm" class="app-form"><label>Full name *<input name="name" value="${escapeHtml(user.name)}" required maxlength="60"></label><label>Organisation *<input name="organization" value="${escapeHtml(user.organization || '')}" required maxlength="80"></label><label>Email address<input value="${escapeHtml(user.email)}" disabled></label><label>Phone number *<input name="phone" value="${escapeHtml(user.phone || '')}" required></label><label class="span-2">City *<input name="city" value="${escapeHtml(user.city || '')}" required></label><div class="form-actions"><button class="btn btn-primary" type="submit">Save changes</button></div></form></section></div>`;
  }

  function renderPublicPreview() {
    const grid = $('#publicFoodGrid');
    if (!grid) return;

    const items = getDonations()
        .filter(item => item.status === 'available')
        .slice(0, 3);

    grid.innerHTML = items.map(item => {
        const fallbackImage = /biryani/i.test(item.title)
            ? images.biryani
            : images.meal;

        return `
            <article class="preview-food-card">
                <div class="preview-food-image">
                    <img
                        src="${escapeHtml(imageFor(item))}"
                        alt="${escapeHtml(item.title)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='${fallbackImage}'"
                    >
                    <span class="food-status status-pill">Available</span>
                </div>

                <div class="preview-food-body">
                    <h3>${escapeHtml(item.title)}</h3>

                    <div class="preview-food-meta">
                        <span>${Number(item.servings || 0)} estimated servings</span>
                        <span>${escapeHtml(item.city)}</span>
                    </div>

                    <div class="preview-food-footer">
                        <span>Shared by <strong>${escapeHtml(item.donorOrg || item.donorName)}</strong></span>
                        <strong>Pickup needed ↗</strong>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

  function openModal(content) {
    modalContent.innerHTML = content;
    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.modal-close')?.focus(), 0);
  }
  function closeModal() {
    modalBackdrop?.classList.add('hidden');
    document.body.style.overflow = '';
  }
  function showFoodDetails(id) {
    const item = getDonations().find(food => food.id === id);
    const user = getCurrentUser();
    if (!item) return toast('This food listing is no longer available.', 'warning');
    const existing = getRequests().find(request => request.donationId === id && request.requesterId === user?.id && !['rejected'].includes(request.status));
    const canRequest = isReceiver(user) && item.status === 'available' && item.donorId !== user.id && !existing;
    const requestButton = canRequest ? `<button class="btn btn-primary" data-action="request-pickup" data-id="${item.id}">Request this pickup ↗</button>` : existing ? `<span class="status-pill ${statusClass(existing.status)}">${statusLabel(existing.status)}</span>` : '';
    openModal(`<span class="eyebrow">FOOD LISTING DETAILS</span><img class="modal-detail-image" src="${escapeHtml(imageFor(item))}" alt="${escapeHtml(item.title)}"><h2 id="modalTitle">${escapeHtml(item.title)}</h2><p class="modal-sub">Shared by ${escapeHtml(item.donorOrg || item.donorName || 'Community donor')} · ${escapeHtml(item.city)}</p><p style="font-size:10px;color:#6f7d72;line-height:1.75">${escapeHtml(item.description || 'No additional notes provided.')}</p><div class="modal-detail-grid"><div class="modal-detail-cell"><small>ESTIMATED SERVINGS</small><strong>${Number(item.servings || 0)}</strong></div><div class="modal-detail-cell"><small>QUANTITY</small><strong>${Number(item.quantity || 0)} ${escapeHtml(item.unit || '')}</strong></div><div class="modal-detail-cell"><small>PICKUP FROM</small><strong>${niceDate(item.pickupFrom, true)}</strong></div><div class="modal-detail-cell"><small>PICKUP DEADLINE</small><strong>${niceDate(item.pickupUntil, true)}</strong></div><div class="modal-detail-cell" style="grid-column:1/-1"><small>PICKUP ADDRESS</small><strong>${escapeHtml(item.pickupAddress || 'To be coordinated')}</strong></div></div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Close</button>${requestButton}</div>`);
  }

  function showNotifications() {
    const user = getCurrentUser();
    const requests = getRequests().filter(request => isDonor(user) ? request.donorId === user.id : request.requesterId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const all = getDonations();
    const entries = requests.map(request => {
      const food = all.find(item => item.id === request.donationId);
      return `<div class="notification-item"><span class="notification-icon">♧</span><div><b>${isDonor(user) ? 'Pickup request update' : `Request ${statusLabel(request.status).toLowerCase()}`}</b><p>${escapeHtml(food?.title || 'Food listing')} · ${escapeHtml(isDonor(user) ? request.requesterOrg || request.requesterName : request.donorOrg || request.donorName)}</p></div></div>`;
    }).join('');
    openModal(`<span class="eyebrow">STAY IN THE LOOP</span><h2 id="modalTitle">Notifications</h2><p class="modal-sub">The latest updates connected to your FoodBridge account.</p>${entries || `<div class="empty-state"><div class="empty-icon">♧</div><h3>You're all caught up</h3><p>New pickup updates will appear here.</p></div>`}`);
    $('#notificationDot').style.display = 'none';
  }

  function handleLogin(form) {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    const user = getUsers().find(item => item.email.toLowerCase() === email && item.password === password);
    if (!user) return toast('Email or password is incorrect. Try one of the demo accounts.', 'error');
    write(STORE.session, { userId: user.id });
    browseSearch = '';
    activeFilter = 'All food';
    toast(`Welcome back, ${user.name.split(' ')[0]}!`);
    showApp('dashboard');
  }

  function handleSignup(form) {
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    const email = String(values.email || '').trim().toLowerCase();
    if (getUsers().some(user => user.email.toLowerCase() === email)) return toast('An account with this email already exists. Please sign in.', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Please enter a valid email address.', 'error');
    const user = { id: uid('user'), name: String(values.name).trim(), organization: String(values.organization).trim(), email, password: String(values.password), phone: String(values.phone).trim(), city: String(values.city).trim(), role: values.role === 'donor' ? 'donor' : 'receiver', createdAt: new Date().toISOString() };
    if (user.password.length < 6) return toast('Use a password with at least 6 characters.', 'error');
    const users = getUsers(); users.push(user);
    if (!write(STORE.users, users)) return;
    write(STORE.session, { userId: user.id });
    toast('Your FoodBridge account is ready. Welcome!');
    showApp('dashboard');
  }

  function handlePostFood(form) {
    const user = getCurrentUser();
    if (!form.dataset.imageData) return toast('Please upload a photo of the food before publishing.', 'error');
    const values = Object.fromEntries(new FormData(form).entries());
    const start = new Date(values.pickupFrom);
    const end = new Date(values.pickupUntil);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start || start < new Date(Date.now() - 60000)) return toast('Please choose a valid pickup window in the future.', 'error');
    const item = {
      id: uid('food'), donorId: user.id, donorName: user.name, donorOrg: user.organization,
      title: String(values.title).trim(), category: values.category,
      quantity: Number(values.quantity), unit: values.unit, servings: Number(values.servings),
      pickupFrom: start.toISOString(), pickupUntil: end.toISOString(),
      pickupAddress: String(values.pickupAddress).trim(), city: String(values.city).trim(),
      description: String(values.description).trim(), image: form.dataset.imageData || '',
      status: 'available', createdAt: new Date().toISOString()
    };
    const donations = getDonations(); donations.unshift(item);
    if (!saveDonations(donations)) return;
    toast('Your food listing is live on the community board!');
    renderPublicPreview();
    showApp('listings');
  }

  function requestPickup(id) {
    const user = getCurrentUser();
    const donations = getDonations();
    const item = donations.find(food => food.id === id);
    if (!item || item.status !== 'available') { closeModal(); return toast('This listing is no longer available.', 'warning'); }
    if (!isReceiver(user)) return toast('Only an NGO or community organisation can request a pickup.', 'error');
    if (item.donorId === user.id) return toast('You cannot request your own listing.', 'warning');
    if (getRequests().some(request => request.donationId === id && request.requesterId === user.id && request.status !== 'rejected')) return toast('You have already requested this listing.', 'warning');
    const request = { id: uid('request'), donationId: id, donorId: item.donorId, donorName: item.donorName, donorOrg: item.donorOrg, requesterId: user.id, requesterName: user.name, requesterOrg: user.organization, message: 'We would like to arrange a pickup for this food listing.', status: 'pending', servings: item.servings, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const requests = getRequests(); requests.unshift(request);
    if (!saveRequests(requests)) return;
    closeModal();
    toast('Pickup request sent to the donor.');
    renderView('myrequests');
  }

  function updateRequest(id, nextStatus) {
    const requests = getRequests();
    const request = requests.find(item => item.id === id);
    if (!request) return toast('This request could not be found.', 'error');
    if (nextStatus === 'approved' && request.status !== 'pending') return toast('This request has already been updated.', 'warning');
    const donationBeforeUpdate = getDonations().find(food => food.id === request.donationId);
    if (nextStatus === 'approved' && (!donationBeforeUpdate || ['claimed', 'collected', 'cancelled'].includes(donationBeforeUpdate.status))) return toast('This food has already been assigned or closed.', 'warning');
    request.status = nextStatus;
    request.updatedAt = new Date().toISOString();
    if (nextStatus === 'approved') {
      requests.forEach(other => {
        if (other.id !== request.id && other.donationId === request.donationId && other.status === 'pending') {
          other.status = 'rejected';
          other.updatedAt = new Date().toISOString();
        }
      });
    }
    if (!saveRequests(requests)) return;
    const donations = getDonations();
    const donation = donations.find(item => item.id === request.donationId);
    if (donation) {
      if (nextStatus === 'approved') { donation.status = 'claimed'; donation.claimedBy = request.requesterId; }
      if (nextStatus === 'rejected') donation.status = 'available';
      if (nextStatus === 'completed') donation.status = 'collected';
      saveDonations(donations);
    }
    const messages = { approved: 'Pickup approved. The organisation can now collect the food.', rejected: 'Request declined. The listing is available again.', completed: 'Pickup marked as collected. Thank you for closing the loop!' };
    toast(messages[nextStatus] || 'Request updated.');
    renderView(currentView);
    renderNavigation();
    renderPublicPreview();
  }

  function cancelListing(id) {
    const donations = getDonations();
    const item = donations.find(food => food.id === id && food.donorId === getCurrentUser()?.id);
    if (!item || item.status !== 'available') return toast('Only available listings can be closed.', 'warning');
    item.status = 'cancelled';
    item.updatedAt = new Date().toISOString();
    saveDonations(donations);
    toast('Listing closed.');
    renderView('listings');
    renderPublicPreview();
  }

  function handleProfile(form) {
    const user = getCurrentUser();
    const values = Object.fromEntries(new FormData(form).entries());
    const users = getUsers();
    const index = users.findIndex(item => item.id === user.id);
    if (index < 0) return;
    users[index] = { ...users[index], name: String(values.name).trim(), organization: String(values.organization).trim(), phone: String(values.phone).trim(), city: String(values.city).trim() };
    if (!write(STORE.users, users)) return;
    toast('Profile details saved.');
    showApp('profile');
  }

  function closeMobileSidebar() { $('#sidebar')?.classList.remove('open'); }

  // Click actions are delegated so dynamically rendered buttons also work.
  document.addEventListener('click', event => {
    const actionNode = event.target.closest('[data-action]');
    if (!actionNode) return;
    const action = actionNode.dataset.action;
    const id = actionNode.dataset.id;
    switch (action) {
      case 'show-login': showAuth('login'); break;
      case 'show-signup': showAuth('signup', actionNode.dataset.role || ''); break;
      case 'back-home': showPublic(); break;
      case 'demo-login': {
        const role = actionNode.dataset.role;
        const accountId = role === 'donor' ? 'demo-donor' : 'demo-receiver';
        write(STORE.session, { userId: accountId });
        browseSearch = ''; activeFilter = 'All food';
        toast(role === 'donor' ? 'You are exploring the donor workspace.' : 'You are exploring the NGO workspace.');
        showApp('dashboard');
        break;
      }
      case 'logout': write(STORE.session, null); showPublic(); toast('You have been signed out.'); break;
      case 'go-dashboard': showApp('dashboard'); break;
      case 'navigate': renderView(actionNode.dataset.view || 'dashboard'); break;
      case 'food-detail': showFoodDetails(id); break;
      case 'request-pickup': requestPickup(id); break;
      case 'approve-request': updateRequest(id, 'approved'); break;
      case 'decline-request': updateRequest(id, 'rejected'); break;
      case 'mark-collected': updateRequest(id, 'completed'); break;
      case 'cancel-listing': cancelListing(id); break;
      case 'close-modal': closeModal(); break;
      case 'notifications': showNotifications(); break;
      case 'filter-food': activeFilter = actionNode.dataset.filter || 'All food'; renderView('browse'); break;
      case 'clear-filters': activeFilter = 'All food'; browseSearch = ''; renderView('browse'); break;
      case 'refresh-food': renderView('browse'); toast('Food board refreshed.'); break;
    }
  });

  async function prepareFoodImage(file) {
    if (!file || !file.type.startsWith('image/')) throw new Error('Choose a valid image file.');
    if (file.size > 8 * 1024 * 1024) throw new Error('Image must be smaller than 8 MB.');
    const bitmap = await createImageBitmap(file);
    const maxSide = 1100;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return canvas.toDataURL('image/jpeg', 0.78);
  }

  document.addEventListener('change', async event => {
    if (event.target.id !== 'foodImageFile') return;
    const file = event.target.files?.[0];
    const form = event.target.closest('form');
    const preview = $('#foodImagePreview');
    const placeholder = $('#foodImagePlaceholder');
    const status = $('#foodImageStatus');
    if (!file || !form) return;
    try {
      status.textContent = 'Preparing your photo…';
      const imageData = await prepareFoodImage(file);
      form.dataset.imageData = imageData;
      preview.src = imageData;
      preview.hidden = false;
      placeholder.hidden = true;
      status.textContent = `${file.name} · Photo ready to upload`;
    } catch (error) {
      delete form.dataset.imageData;
      event.target.value = '';
      preview.removeAttribute('src');
      preview.hidden = true;
      placeholder.hidden = false;
      status.textContent = 'A photo is required. Please choose another image.';
      toast(error.message || 'Could not read this image. Please try another.', 'error');
    }
  });

  document.addEventListener('submit', event => {
    const form = event.target;
    if (form.id === 'loginForm') { event.preventDefault(); handleLogin(form); }
    if (form.id === 'signupForm') { event.preventDefault(); handleSignup(form); }
    if (form.id === 'postFoodForm') { event.preventDefault(); handlePostFood(form); }
    if (form.id === 'profileForm') { event.preventDefault(); handleProfile(form); }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'browseSearch') {
      const value = event.target.value;
      const cursor = event.target.selectionStart;
      browseSearch = value;
      const start = appView.scrollTop;
      const focused = document.activeElement;
      renderView('browse');
      const nextSearch = $('#browseSearch');
      if (nextSearch) { nextSearch.focus(); nextSearch.setSelectionRange(cursor, cursor); }
      appView.scrollTop = start;
    }
    if (event.target.id === 'globalSearch') {
      browseSearch = event.target.value;
      if (getCurrentUser()) renderView('browse');
      const search = $('#browseSearch');
      if (search) { search.value = browseSearch; search.focus(); }
    }
  });

  $('#sidebarToggle')?.addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#modalBackdrop')?.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeModal(); closeMobileSidebar(); }
    if (event.key === '/' && getCurrentUser() && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault(); $('#globalSearch')?.focus();
    }
  });
  $('#publicMenuBtn')?.addEventListener('click', () => {
    const nav = $('#siteNav');
    nav.classList.toggle('mobile-open');
    $('#publicMenuBtn').setAttribute('aria-expanded', nav.classList.contains('mobile-open') ? 'true' : 'false');
  });
  $$('#siteNav a').forEach(link => link.addEventListener('click', () => $('#siteNav').classList.remove('mobile-open')));

  // Initialise demo data and restore an existing local session when present.
  seedData();
  renderPublicPreview();
  const existingUser = getCurrentUser();
  if (existingUser) showApp('dashboard'); else showPublic();
})();
