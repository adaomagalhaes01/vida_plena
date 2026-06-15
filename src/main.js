import { mockPsychologists, mockServices, mockTestimonials, mockFaq } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  AOS.init({
    once: true,
    offset: 50,
    duration: 800,
    easing: 'ease-out-cubic',
  });

  // Setup UI components
  setupNavbar();
  setupMobileMenu();
  renderServices();
  renderPsychologists();
  renderTestimonials();
  renderFaq();
  setupModal();
  setupContactForm();
});

// Navbar Scroll Effect
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('py-3', 'shadow-md', 'border-b', 'border-gray-100');
      navbar.classList.remove('py-5');
    } else {
      navbar.classList.add('py-5');
      navbar.classList.remove('py-3', 'shadow-md', 'border-b', 'border-gray-100');
    }
  });
}

// Mobile Menu Drawer
function setupMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-drawer-btn');
  const drawer = document.getElementById('mobile-drawer');
  const content = document.getElementById('mobile-drawer-content');
  const links = document.querySelectorAll('.mobile-link');

  const openDrawer = () => {
    drawer.classList.remove('opacity-0', 'pointer-events-none');
    content.classList.remove('translate-x-full');
  };

  const closeDrawer = () => {
    drawer.classList.add('opacity-0', 'pointer-events-none');
    content.classList.add('translate-x-full');
  };

  btn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// Render Services
function renderServices() {
  const grid = document.getElementById('services-grid');
  let html = '';
  
  mockServices.forEach((service, index) => {
    const delay = (index % 4) * 100;
    html += `
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <i class="${service.icon}"></i>
        </div>
        <h3 class="text-xl font-bold mb-3 text-gray-900">${service.title}</h3>
        <p class="text-gray-600 mb-6 leading-relaxed">${service.description}</p>
        <a href="#psicologos" class="inline-flex items-center font-bold text-primary hover:text-secondary group-hover:gap-2 transition-all">
          Saber Mais <i class="ph ph-arrow-right ml-1"></i>
        </a>
      </div>
    `;
  });
  
  if (grid) grid.innerHTML = html;
}

// Render Psychologists
function renderPsychologists() {
  const grid = document.getElementById('psychologists-grid');
  let html = '';

  mockPsychologists.forEach((psy, index) => {
    const delay = (index % 3) * 150;
    html += `
      <div class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="relative h-64 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10"></div>
          <img src="${psy.image}" alt="${psy.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
          <div class="absolute bottom-4 left-4 z-20">
            <span class="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
              ${psy.specialty}
            </span>
          </div>
        </div>
        <div class="p-6 flex-grow flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-bold text-gray-900">${psy.name}</h3>
            <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-600 text-sm font-bold">
              <i class="ph-fill ph-star"></i> ${psy.rating}
            </div>
          </div>
          <p class="text-gray-500 text-sm mb-4"><i class="ph ph-clock mr-1"></i> ${psy.availability}</p>
          <div class="mt-auto pt-4 border-t border-gray-100">
            <button class="open-modal-btn w-full py-3 text-primary font-bold bg-blue-50 rounded-xl hover:bg-primary hover:text-white transition-colors duration-300 flex justify-center items-center gap-2" data-id="${psy.id}">
              Marcar Consulta <i class="ph ph-calendar-plus text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  if (grid) grid.innerHTML = html;
}

// Render Testimonials
function renderTestimonials() {
  const slider = document.getElementById('testimonial-slider');
  let html = '';

  mockTestimonials.forEach(test => {
    html += `
      <div class="w-full flex-shrink-0 px-4">
        <div class="bg-white p-8 md:p-12 rounded-3xl shadow-lg shadow-blue-900/5 text-center">
          <img src="${test.image}" alt="${test.name}" class="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-4 border-blue-50">
          <p class="text-gray-600 italic text-lg md:text-xl mb-8 leading-relaxed">"${test.content}"</p>
          <h4 class="font-bold text-gray-900 text-lg">${test.name}</h4>
          <span class="text-primary text-sm font-medium">${test.role}</span>
        </div>
      </div>
    `;
  });

  if (slider) {
    slider.innerHTML = html;
    setupSlider();
  }
}

// Setup Slider Logic
function setupSlider() {
  const slider = document.getElementById('testimonial-slider');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  
  let currentIndex = 0;
  const total = mockTestimonials.length;

  const updateSlider = () => {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? total - 1 : currentIndex - 1;
    updateSlider();
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex === total - 1) ? 0 : currentIndex + 1;
    updateSlider();
  });

  // Auto slide
  setInterval(() => {
    currentIndex = (currentIndex === total - 1) ? 0 : currentIndex + 1;
    updateSlider();
  }, 5000);
}

// Render FAQ
function renderFaq() {
  const container = document.getElementById('faq-container');
  let html = '';

  mockFaq.forEach((item, index) => {
    html += `
      <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all duration-300" data-aos="fade-up" data-aos-delay="${index * 100}">
        <button class="faq-btn w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none">
          <span class="font-bold text-gray-900">${item.question}</span>
          <i class="ph ph-caret-down text-gray-400 transition-transform duration-300"></i>
        </button>
        <div class="faq-content max-h-0 overflow-hidden transition-all duration-300 bg-gray-50">
          <p class="p-6 text-gray-600 border-t border-gray-100">${item.answer}</p>
        </div>
      </div>
    `;
  });

  if (container) {
    container.innerHTML = html;
    
    // Accordion Logic
    const btns = container.querySelectorAll('.faq-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        const isOpen = content.style.maxHeight;

        // Close all
        container.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = null);
        container.querySelectorAll('.faq-btn i').forEach(i => i.style.transform = 'rotate(0deg)');

        if (!isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  }
}

// Modal Logic
function setupModal() {
  const modal = document.getElementById('appointment-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const cancelBtn = document.getElementById('cancel-modal-btn');
  const form = document.getElementById('appointment-form');

  const openModal = (psyId) => {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.firstElementChild.classList.remove('scale-95');
    
    // Set min date to today
    const dateInput = document.getElementById('appt-date');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Populate psychologist info if id is provided
    const psyInfoDiv = document.getElementById('modal-psychologist-info');
    if (psyId) {
      const psy = mockPsychologists.find(p => p.id == psyId);
      if (psy) {
        document.getElementById('psy-id').value = psy.id;
        document.getElementById('modal-psy-img').src = psy.image;
        document.getElementById('modal-psy-name').textContent = psy.name;
        document.getElementById('modal-psy-spec').textContent = psy.specialty;
        psyInfoDiv.classList.remove('hidden');
        
        // Auto-select service if possible
        const serviceSelect = document.getElementById('appt-service');
        Array.from(serviceSelect.options).forEach(opt => {
          if (psy.specialty.includes(opt.value)) opt.selected = true;
        });
      }
    } else {
      document.getElementById('psy-id').value = '';
      psyInfoDiv.classList.add('hidden');
      document.getElementById('appt-service').selectedIndex = 0;
    }
  };

  const closeModal = () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.firstElementChild.classList.add('scale-95');
    form.reset();
  };

  // Attach to dynamic buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-modal-btn');
    if (btn) {
      openModal(btn.dataset.id);
    }
    // Also attach to header CTA
    if (e.target.closest('a[href="#psicologos"]') && e.target.textContent.includes('Marcar Consulta')) {
      // Just scrolls
    }
  });

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const appointment = {
      id: Date.now(),
      psyId: document.getElementById('psy-id').value,
      psyName: document.getElementById('modal-psy-name').textContent,
      name: document.getElementById('appt-name').value,
      phone: document.getElementById('appt-phone').value,
      email: document.getElementById('appt-email').value,
      date: document.getElementById('appt-date').value,
      time: document.getElementById('appt-time').value,
      service: document.getElementById('appt-service').value,
      status: 'Pendente',
      createdAt: new Date().toISOString()
    };

    // Save to LocalStorage
    const appointments = JSON.parse(localStorage.getItem('vp_appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('vp_appointments', JSON.stringify(appointments));

    closeModal();
    showToast('Consulta agendada com sucesso! Receberá um email em breve.');
  });
}

// Contact Form
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = {
      id: Date.now(),
      name: document.getElementById('c-nome').value,
      phone: document.getElementById('c-telefone').value,
      email: document.getElementById('c-email').value,
      content: document.getElementById('c-mensagem').value,
      date: new Date().toISOString(),
      read: false
    };

    // Save to LocalStorage
    const messages = JSON.parse(localStorage.getItem('vp_messages') || '[]');
    messages.push(message);
    localStorage.setItem('vp_messages', JSON.stringify(messages));

    form.reset();
    successMsg.classList.remove('hidden');
    setTimeout(() => {
      successMsg.classList.add('hidden');
    }, 5000);
  });
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.remove('translate-y-[150%]');
    setTimeout(() => {
      toast.classList.add('translate-y-[150%]');
    }, 4000);
  }
}
