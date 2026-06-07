document.addEventListener('DOMContentLoaded', () => {
  let currentLang = localStorage.getItem('howl_finished_lang') || 'en';
  let currentTheme = localStorage.getItem('howl_finished_theme') || 'light';

  const langToggleBtn = document.getElementById('lang-toggle');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const backToTopBtn = document.getElementById('back-to-top');

  function getText(key) {
    if (window.translations && window.translations[currentLang] && window.translations[currentLang][key]) {
      return window.translations[currentLang][key];
    }
    return null;
  }

  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('howl_finished_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const text = getText(key);

      if (!text) return;

      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.setAttribute('placeholder', text);
      } else {
        element.innerHTML = text;
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
      const key = element.getAttribute('data-i18n-alt');
      const text = getText(key);
      if (text) element.setAttribute('alt', text);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const key = element.getAttribute('data-i18n-aria');
      const text = getText(key);
      if (text) element.setAttribute('aria-label', text);
    });

    if (langToggleBtn) {
      langToggleBtn.textContent = lang === 'cs' ? 'English' : 'Čeština';
    }

    updateThemeButtonText();
    updateFormValidationLanguage();
    updatePortalText();
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      updateLanguage(currentLang === 'cs' ? 'en' : 'cs');
    });
  }

  function updateThemeButtonText() {
    if (!themeToggleBtn) return;

    const key = currentTheme === 'light' ? 'theme_dark' : 'theme_light';
    themeToggleBtn.textContent = getText(key) || (currentTheme === 'light' ? 'Dark Mode' : 'Light Mode');
  }

  function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('howl_finished_theme', theme);
    updateThemeButtonText();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('active'));
  }

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const doorVisual = document.getElementById('door-visual');
  const dialPointer = document.getElementById('dial-pointer');
  const portalGlow = document.getElementById('portal-glow');
  const indicatorItems = document.querySelectorAll('.color-indicator-item');
  const doorOpenBtn = document.getElementById('door-open-btn');

  const doorDestinations = {
    green: { rotation: 0, className: 'green', url: 'gallery.html', i18nKey: 'nav_gallery' },
    blue: { rotation: 90, className: 'blue', url: 'characters.html', i18nKey: 'nav_characters' },
    red: { rotation: 180, className: 'red', url: 'about.html', i18nKey: 'nav_about' },
    black: { rotation: 270, className: 'black', url: 'contact.html', i18nKey: 'nav_contact' }
  };

  let activeDoorColor = 'green';
  let isNavigating = false;

  function updatePortalText() {
    if (!portalGlow || !doorDestinations[activeDoorColor]) return;

    const key = doorDestinations[activeDoorColor].i18nKey;
    portalGlow.textContent = getText(key) || key;
  }

  function selectDoorColor(color) {
    if (!doorDestinations[color] || isNavigating) return;

    activeDoorColor = color;

    indicatorItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-color') === color);
    });

    if (dialPointer) {
      dialPointer.style.transform = `rotate(${doorDestinations[color].rotation}deg)`;
    }

    if (portalGlow) {
      portalGlow.className = `portal-glow ${doorDestinations[color].className}`;
      updatePortalText();
    }
  }

  indicatorItems.forEach((item) => {
    item.addEventListener('click', () => {
      selectDoorColor(item.getAttribute('data-color'));
    });
  });

  function openDoorAndNavigate() {
    if (!doorVisual || isNavigating) return;

    isNavigating = true;
    doorVisual.classList.add('open');

    setTimeout(() => {
      window.location.href = doorDestinations[activeDoorColor].url;
    }, 900);
  }

  if (doorOpenBtn) {
    doorOpenBtn.addEventListener('click', openDoorAndNavigate);
  }

  document.querySelectorAll('.door-panel, .door-knob').forEach((part) => {
    part.addEventListener('click', openDoorAndNavigate);
  });

  if (doorVisual) {
    selectDoorColor('green');
  }

  const characterFilterButtons = document.querySelectorAll('.character-filters .filter-btn');
  const characterCards = document.querySelectorAll('.character-card');

  characterFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      characterFilterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      characterCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        const shouldShow = filterValue === 'all' || categories.includes(filterValue);
        card.classList.toggle('hidden', !shouldShow);
      });
    });
  });

  const galleryFilterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let visibleGalleryItems = Array.from(galleryItems);
  let currentGalleryIndex = 0;

  function updateVisibleGalleryItems() {
    visibleGalleryItems = Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
  }

  galleryFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      galleryFilterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filterValue === 'all' || category === filterValue;
        item.classList.toggle('hidden', !shouldShow);
      });

      updateVisibleGalleryItems();
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.querySelector('h4');

    if (!lightbox || !lightboxImage || !lightboxCaption || !img || !caption) return;

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = caption.textContent;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showLightboxImage(step) {
    if (visibleGalleryItems.length === 0) return;

    currentGalleryIndex += step;

    if (currentGalleryIndex < 0) {
      currentGalleryIndex = visibleGalleryItems.length - 1;
    }

    if (currentGalleryIndex >= visibleGalleryItems.length) {
      currentGalleryIndex = 0;
    }

    openLightbox(visibleGalleryItems[currentGalleryIndex]);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateVisibleGalleryItems();
      currentGalleryIndex = visibleGalleryItems.indexOf(item);
      openLightbox(item);
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.click();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(1));

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showLightboxImage(-1);
    if (event.key === 'ArrowRight') showLightboxImage(1);
  });

  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const successCloseBtn = document.getElementById('success-close-btn');
  const inputName = document.getElementById('name');
  const inputEmail = document.getElementById('email');
  const inputMessage = document.getElementById('message');

  function showInputError(input, errorId, isInvalid) {
    const errorMessage = document.getElementById(errorId);

    if (!input || !errorMessage) return;

    input.classList.toggle('invalid', isInvalid);
    errorMessage.classList.toggle('visible', isInvalid);
    input.setAttribute('aria-invalid', String(isInvalid));
  }

  function validateName() {
    if (!inputName) return true;

    const isInvalid = inputName.value.trim().length < 2;
    showInputError(inputName, 'error-name', isInvalid);
    return !isInvalid;
  }

  function validateEmail() {
    if (!inputEmail) return true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isInvalid = !emailPattern.test(inputEmail.value.trim());
    showInputError(inputEmail, 'error-email', isInvalid);
    return !isInvalid;
  }

  function validateMessage() {
    if (!inputMessage) return true;

    const isInvalid = inputMessage.value.trim().length < 10;
    showInputError(inputMessage, 'error-message', isInvalid);
    return !isInvalid;
  }

  function updateFormValidationLanguage() {
    const errorName = document.getElementById('error-name');
    const errorEmail = document.getElementById('error-email');
    const errorMessage = document.getElementById('error-message');

    if (errorName) errorName.textContent = getText('contact_error_name') || errorName.textContent;
    if (errorEmail) errorEmail.textContent = getText('contact_error_email') || errorEmail.textContent;
    if (errorMessage) errorMessage.textContent = getText('contact_error_message') || errorMessage.textContent;
  }

  if (inputName) inputName.addEventListener('input', validateName);
  if (inputEmail) inputEmail.addEventListener('input', validateEmail);
  if (inputMessage) inputMessage.addEventListener('input', validateMessage);

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const isFormValid = validateName() && validateEmail() && validateMessage();

      if (isFormValid) {
        contactForm.reset();

        if (successModal) {
          successModal.classList.add('active');
          if (successCloseBtn) successCloseBtn.focus();
        }
      }
    });
  }

  if (successCloseBtn && successModal) {
    successCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }

  function setMiniError(input, errorElement, isInvalid) {
    if (!input || !errorElement) return;
    input.classList.toggle('invalid', isInvalid);
    errorElement.classList.toggle('visible', isInvalid);
    input.setAttribute('aria-invalid', String(isInvalid));
  }

  document.querySelectorAll('.js-mini-contact-form').forEach((form) => {
    const miniName = form.querySelector('[name="mini-name"]');
    const miniEmail = form.querySelector('[name="mini-email"]');
    const miniMessage = form.querySelector('[name="mini-message"]');
    const status = form.querySelector('.mini-form-status');
    const nameError = form.querySelector('[id^="bottom-error-name"]');
    const emailError = form.querySelector('[id^="bottom-error-email"]');
    const messageError = form.querySelector('[id^="bottom-error-message"]');

    function validateMiniForm() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameInvalid = !miniName || miniName.value.trim().length < 2;
      const emailInvalid = !miniEmail || !emailPattern.test(miniEmail.value.trim());
      const messageInvalid = !miniMessage || miniMessage.value.trim().length < 10;

      setMiniError(miniName, nameError, nameInvalid);
      setMiniError(miniEmail, emailError, emailInvalid);
      setMiniError(miniMessage, messageError, messageInvalid);

      return !(nameInvalid || emailInvalid || messageInvalid);
    }

    [miniName, miniEmail, miniMessage].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          validateMiniForm();
          if (status) {
            status.textContent = '';
            status.className = 'mini-form-status';
          }
        });
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (validateMiniForm()) {
        form.reset();
        if (status) {
          status.textContent = getText('bottom_contact_success') || 'Message sent.';
          status.className = 'mini-form-status success';
        }
      } else if (status) {
        status.textContent = getText('bottom_contact_error') || 'Please check the form.';
        status.className = 'mini-form-status error';
      }
    });
  });

  setTheme(currentTheme);
  updateLanguage(currentLang);
});
