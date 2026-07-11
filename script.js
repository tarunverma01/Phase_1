document.addEventListener('DOMContentLoaded', function () {
  initializeNavbar();
  initializeActiveNavHighlight();
  initializeScrollAnimations();
  initializeScrollTopButton();
  initializeThemeToggle();
  initializeContactForm();
  initializeNewsletterForm();
  setFooterYear();
});

function initializeNavbar() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (!header || !hamburger || !navLinks) return;

  function handleHeaderScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll();

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  hamburger.addEventListener('click', toggleMenu);

  navLinkItems.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (event) {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedHamburger = hamburger.contains(event.target);

    if (!clickedInsideMenu && !clickedHamburger) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

function initializeActiveNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinkItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');

        navLinkItems.forEach(function (link) {
          const linkTarget = link.getAttribute('href').replace('#', '');
          link.classList.toggle('active-link', linkTarget === currentId);
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

function initializeScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });

  revealElements.forEach(function (element) {
    observer.observe(element);
  });
}

function initializeScrollTopButton() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  function toggleButtonVisibility() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleButtonVisibility);

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initializeThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggle');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('anchorly-theme');

  // Default: light mode (no data-theme attribute)
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    // Show sun when currently in dark mode (so user can switch to light)
    themeToggleBtn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    // Show moon when currently in light mode (so user can switch to dark)
    themeToggleBtn.textContent = '🌙';
  }

  themeToggleBtn.addEventListener('click', function () {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('anchorly-theme', 'light');
      themeToggleBtn.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('anchorly-theme', 'dark');
      themeToggleBtn.textContent = '☀️';
    }
  });
}


function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formSuccess = document.getElementById('formSuccess');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    input.closest('.form-group').classList.add('has-error');
    errorEl.textContent = message;
  }

  function clearError(input, errorId) {
    const errorEl = document.getElementById(errorId);
    input.closest('.form-group').classList.remove('has-error');
    errorEl.textContent = '';
  }

  function validateName() {
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'nameError', 'Please enter your full name.');
      return false;
    }
    clearError(nameInput, 'nameError');
    return true;
  }

  function validateEmail() {
    if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, 'emailError', 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput, 'emailError');
    return true;
  }

  function validateMessage() {
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'messageError', 'Message should be at least 10 characters.');
      return false;
    }
    clearError(messageInput, 'messageError');
    return true;
  }

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
      formSuccess.textContent = 'Thanks! Your message has been sent — we will reply soon.';
      form.reset();

      setTimeout(function () {
        formSuccess.textContent = '';
      }, 5000);
    } else {
      formSuccess.textContent = '';
    }
  });
}

function initializeNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');

    if (emailInput.value.trim() !== '') {
      emailInput.value = '';
      emailInput.placeholder = 'Subscribed! Thank you.';
    }
  });
}

function setFooterYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
