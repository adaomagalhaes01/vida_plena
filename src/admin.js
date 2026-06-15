import { mockPsychologists, mockServices } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupLogin();
  setupNavigation();
  loadDashboardData();
  
  // Expose global function for deleting (mock only)
  window.deleteAppointment = (id) => {
    if (confirm('Tem a certeza que deseja remover esta marcação?')) {
      let appointments = JSON.parse(localStorage.getItem('vp_appointments') || '[]');
      appointments = appointments.filter(a => a.id !== id);
      localStorage.setItem('vp_appointments', JSON.stringify(appointments));
      loadDashboardData();
    }
  };
});

function checkAuth() {
  const isLoggedIn = localStorage.getItem('vp_admin_logged') === 'true';
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  if (isLoggedIn) {
    loginView.classList.add('opacity-0', 'pointer-events-none', 'hidden');
    dashboardView.classList.remove('hidden');
    setTimeout(() => dashboardView.classList.remove('opacity-0'), 50);
  } else {
    loginView.classList.remove('opacity-0', 'pointer-events-none', 'hidden');
    dashboardView.classList.add('hidden', 'opacity-0');
  }
}

function setupLogin() {
  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('login-error');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('vp_admin_logged', 'true');
    checkAuth();
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('vp_admin_logged');
    checkAuth();
  });
}

function setupNavigation() {
  const btns = document.querySelectorAll('.nav-btn, .nav-btn-inline');
  const panels = document.querySelectorAll('.admin-panel');
  const sidebar = document.getElementById('admin-sidebar');
  const mobileMenuBtn = document.getElementById('admin-mobile-menu-btn');
  const closeSidebarBtn = document.getElementById('close-admin-sidebar');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      // Update active state in sidebar
      if (btn.classList.contains('nav-btn')) {
        document.querySelectorAll('.nav-btn').forEach(b => {
          b.classList.remove('active', 'bg-amber-50', 'text-primary');
          b.classList.add('text-gray-600');
        });
        btn.classList.add('active', 'bg-amber-50', 'text-primary');
        btn.classList.remove('text-gray-600');
      }

      // Show target panel
      panels.forEach(p => p.classList.add('hidden'));
      document.getElementById(targetId)?.classList.remove('hidden');

      // On mobile, close sidebar after clicking a link
      if (window.innerWidth < 768 && btn.classList.contains('nav-btn')) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  });

  // Mobile sidebar toggle
  mobileMenuBtn?.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
  });

  closeSidebarBtn?.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
  });
}

function loadDashboardData() {
  const appointments = JSON.parse(localStorage.getItem('vp_appointments') || '[]');
  const messages = JSON.parse(localStorage.getItem('vp_messages') || '[]');
  const psychologists = mockPsychologists; // using mock
  const services = mockServices;

  // Stats
  document.getElementById('stat-consultas').textContent = appointments.length;
  document.getElementById('stat-mensagens').textContent = messages.length;
  document.getElementById('stat-psicologos').textContent = psychologists.length;
  document.getElementById('stat-pacientes').textContent = new Set(appointments.map(a => a.email)).size + 120; // Some base mock number

  // Render recent consultations on dashboard
  const tbodyRecent = document.getElementById('recent-consultations-tbody');
  const tbodyAll = document.getElementById('all-consultations-tbody');
  
  if (appointments.length === 0) {
    const emptyRow = `<tr><td colspan="6" class="p-4 text-center text-gray-500">Nenhuma consulta marcada.</td></tr>`;
    if (tbodyRecent) tbodyRecent.innerHTML = emptyRow;
    if (tbodyAll) tbodyAll.innerHTML = emptyRow;
  } else {
    let htmlRecent = '';
    let htmlAll = '';
    
    // Reverse to show newest first
    const sorted = [...appointments].reverse();

    sorted.forEach((appt, index) => {
      const row = `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="p-4">
            <p class="font-medium text-gray-900">${appt.name}</p>
            <p class="text-xs text-gray-500">${appt.email}</p>
          </td>
          <td class="p-4">${appt.date} às ${appt.time}</td>
          <td class="p-4">${appt.service}</td>
          <td class="p-4">
            <span class="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs font-bold rounded-md">Pendente</span>
          </td>
        </tr>
      `;
      if (index < 5) htmlRecent += row;

      htmlAll += `
        <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
          <td class="p-4 font-medium text-gray-900">${appt.name}</td>
          <td class="p-4">
            <p>${appt.phone}</p>
            <p class="text-xs text-gray-500">${appt.email}</p>
          </td>
          <td class="p-4">${appt.psyName || 'Não especificado'}</td>
          <td class="p-4">${appt.service}</td>
          <td class="p-4 font-medium">${appt.date} - ${appt.time}</td>
          <td class="p-4 text-center">
            <button onclick="window.deleteAppointment(${appt.id})" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Remover">
              <i class="ph ph-trash text-lg"></i>
            </button>
          </td>
        </tr>
      `;
    });

    if (tbodyRecent) tbodyRecent.innerHTML = htmlRecent;
    if (tbodyAll) tbodyAll.innerHTML = htmlAll;
  }

  // Render Psychologists Grid
  const psyGrid = document.getElementById('admin-psy-grid');
  if (psyGrid) {
    psyGrid.innerHTML = psychologists.map(psy => `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <img src="${psy.image}" class="w-16 h-16 rounded-xl object-cover">
        <div class="flex-1">
          <h4 class="font-bold text-gray-900">${psy.name}</h4>
          <p class="text-xs text-primary font-medium">${psy.specialty}</p>
        </div>
        <button class="text-gray-400 hover:text-primary"><i class="ph ph-pencil-simple text-lg"></i></button>
      </div>
    `).join('');
  }

  // Render Services Table
  const srvTbody = document.getElementById('all-services-tbody');
  if (srvTbody) {
    srvTbody.innerHTML = services.map(srv => `
      <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50">
        <td class="p-4 flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-50 text-primary flex items-center justify-center rounded-lg">
            <i class="${srv.icon} text-lg"></i>
          </div>
          <span class="font-bold text-gray-900">${srv.title}</span>
        </td>
        <td class="p-4 text-gray-600">${srv.description}</td>
        <td class="p-4 text-center">
          <button class="p-2 text-gray-400 hover:text-primary transition-colors"><i class="ph ph-pencil-simple text-lg"></i></button>
        </td>
      </tr>
    `).join('');
  }

  // Render Messages
  const msgContainer = document.getElementById('messages-container');
  if (msgContainer) {
    if (messages.length === 0) {
      msgContainer.innerHTML = `<div class="p-6 bg-white rounded-3xl border border-gray-100 text-center text-gray-500">Nenhuma mensagem recebida.</div>`;
    } else {
      msgContainer.innerHTML = [...messages].reverse().map(msg => `
        <div class="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-gray-900 text-lg">${msg.name}</h4>
              <span class="text-xs text-gray-400">${new Date(msg.date).toLocaleDateString('pt-PT')}</span>
            </div>
            <p class="text-sm text-primary font-medium mb-3">${msg.email} • ${msg.phone}</p>
            <p class="text-gray-600 bg-gray-50 p-4 rounded-xl">${msg.content}</p>
          </div>
          <div class="flex flex-row md:flex-col gap-2 justify-end">
            <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-secondary">Responder</button>
            <button class="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">Arquivar</button>
          </div>
        </div>
      `).join('');
    }
  }
}
