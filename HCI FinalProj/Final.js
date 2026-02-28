/* ===========================
   WANDERLUX — Final.js
   =========================== */

// ── HEADER SCROLL EFFECT ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 50
    ? 'rgba(10,10,10,0.98)'
    : 'rgba(10,10,10,0.9)';
});

// ── MOBILE MENU ──
const menuBar = document.getElementById('menu-bar');
const navbar = document.querySelector('.navbar');

menuBar.addEventListener('click', (e) => {
  e.stopPropagation();
  navbar.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !menuBar.contains(e.target)) {
    navbar.classList.remove('active');
  }
});

// ── SEARCH BAR ──
const searchBtn = document.getElementById('search-btn');
const searchWrap = document.getElementById('search-bar-wrap');

searchBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  searchWrap.classList.toggle('active');
  if (searchWrap.classList.contains('active')) {
    document.getElementById('search-bar').focus();
  }
});

// ── LOGIN MODAL ──
const loginBtn = document.getElementById('login-btn');
const loginOverlay = document.getElementById('login-overlay');
const formClose = document.getElementById('form-close');

loginBtn.addEventListener('click', () => loginOverlay.classList.add('active'));
formClose.addEventListener('click', () => loginOverlay.classList.remove('active'));
loginOverlay.addEventListener('click', (e) => {
  if (e.target === loginOverlay) loginOverlay.classList.remove('active');
});

// ── HERO SLIDESHOW ──
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slide-dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(i);
    startAutoSlide();
  });
});

startAutoSlide();

// ── SWIPER REVIEWS ──
new Swiper('.review-slider', {
  loop: true,
  spaceBetween: 30,
  slidesPerView: 1,
  autoplay: { delay: 4500, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    640: { slidesPerView: 1 },
    900: { slidesPerView: 2 },
    1200: { slidesPerView: 3 }
  }
});

// ── BOOKING FORM ──
const bookingForm = document.getElementById('booking-form');
const bookingTableBody = document.querySelector('#booking-table tbody');
const emptyState = document.getElementById('empty-state');
const tableWrap = document.querySelector('.table-wrap');

let bookings = [];

function renderBookings() {
  bookingTableBody.innerHTML = '';

  if (bookings.length === 0) {
    emptyState.style.display = 'block';
    tableWrap.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  tableWrap.style.display = 'block';

  bookings.forEach((b, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${b.place}</td>
      <td>${b.guests} guest${b.guests !== 1 ? 's' : ''}</td>
      <td>${formatDate(b.arrival)}</td>
      <td>${formatDate(b.leaving)}</td>
      <td><button onclick="deleteBooking(${i})">Cancel</button></td>
    `;
    bookingTableBody.appendChild(tr);
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

window.deleteBooking = function(index) {
  bookings.splice(index, 1);
  renderBookings();
};

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const place = document.getElementById('place-name-input').value.trim();
  const guests = parseInt(document.getElementById('num-of-guests-input').value);
  const arrival = document.getElementById('arrival-date-input').value;
  const leaving = document.getElementById('leaving-date-input').value;

  if (!place || !guests || !arrival || !leaving) {
    alert('Please fill in all fields.');
    return;
  }

  if (new Date(leaving) <= new Date(arrival)) {
    alert('Departure date must be after arrival date.');
    return;
  }

  bookings.push({ place, guests, arrival, leaving });
  renderBookings();
  bookingForm.reset();

  // Scroll to details section
  document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
});

// Initial render
renderBookings();

// ── CONTACT FORM ──
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = '#2ecc71';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.color = '';
      contactForm.reset();
    }, 3000);
  });
}

// ── INTERSECTION OBSERVER (fade in sections) ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .gallery-card, .review-card, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});