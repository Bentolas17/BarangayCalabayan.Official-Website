/* ============================================================
   BARANGAY CALABAYAN — one.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. LOADER ─────────────────────────────────────────── */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });

  /* ── 2. NAVBAR SCROLL + ACTIVE LINK ────────────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled state
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    // Back to top button
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 3. HAMBURGER MENU ──────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navList   = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navList.classList.toggle('open');
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navList.classList.remove('open');
    });
  });

  /* ── 4. SMOOTH SCROLL FOR HERO BUTTONS ──────────────────── */
  const heroOfficials = document.getElementById('heroOfficials');
  const heroContact   = document.getElementById('heroContact');

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  if (heroOfficials) heroOfficials.addEventListener('click', () => scrollTo('officials'));
  if (heroContact)   heroContact.addEventListener('click',   () => scrollTo('contact'));

  /* ── 5. BACK TO TOP ─────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 6. STAT COUNTER ANIMATION ──────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  function maybeStartCounters() {
    if (countersStarted) return;
    const hero = document.querySelector('.hero-stats');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      countersStarted = true;
      statNums.forEach(animateCounter);
    }
  }

  window.addEventListener('scroll', maybeStartCounters, { passive: true });
  setTimeout(maybeStartCounters, 200); // trigger on load if already visible

  /* ── 7. REVEAL ON SCROLL ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 8. PROJECT FILTER ──────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── 9. LOCAL IMAGE PICKER FOR OFFICIAL CARDS ───────────── */
  /**
   * Every .photo-placeholder that does NOT already contain an <img>
   * gets a hidden <input type="file"> and becomes clickable.
   * When a user picks a file from their device, it previews inside.
   */
  const placeholders = document.querySelectorAll('.photo-placeholder');

  placeholders.forEach(ph => {
    // If there's already a real img inside, skip (e.g. Punong Barangay slot)
    const existingImg = ph.querySelector('img');

    // Build the file input
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = 'image/*';
    input.style.cssText = 'display:none;';
    ph.appendChild(input);

    // Style the placeholder as clickable
    ph.style.cursor = 'pointer';
    ph.title = 'Click to upload a photo';

    ph.addEventListener('click', (e) => {
      // Don't trigger if clicking the img itself
      if (e.target.tagName === 'IMG') return;
      input.click();
    });

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        // Remove any existing text/span placeholder content
        Array.from(ph.childNodes).forEach(node => {
          if (node !== input && node.tagName !== 'IMG') node.remove();
        });

        let img = ph.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          ph.insertBefore(img, input);
        }

        img.src = ev.target.result;
        img.alt = 'Official photo';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:top center;display:block;';
        ph.style.cursor = 'pointer'; // keep clickable for re-upload
        ph.title = 'Click to change photo';
      };
      reader.readAsDataURL(file);
    });
  });

  /* ── 10. CONTACT FORM ───────────────────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');
      let valid     = true;

      function setError(field, errId, msg) {
        const errEl = document.getElementById(errId);
        if (!field.value.trim()) {
          field.classList.add('error');
          if (errEl) errEl.textContent = msg;
          valid = false;
        } else {
          field.classList.remove('error');
          if (errEl) errEl.textContent = '';
        }
      }

      function validateEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }

      setError(name,    'nameError',    'Full name is required.');
      setError(message, 'messageError', 'Please describe your concern.');

      // Email: presence + format
      const emailErr = document.getElementById('emailError');
      if (!email.value.trim()) {
        email.classList.add('error');
        if (emailErr) emailErr.textContent = 'Email address is required.';
        valid = false;
      } else if (!validateEmail(email.value.trim())) {
        email.classList.add('error');
        if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
        valid = false;
      } else {
        email.classList.remove('error');
        if (emailErr) emailErr.textContent = '';
      }

      if (!valid) return;

      // Simulate send
      const btn = document.getElementById('submitBtn');
      btn.textContent = 'Sending…';
      btn.disabled    = true;

      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled    = false;
        form.reset();
        if (formSuccess) {
          formSuccess.style.display = 'block';
          setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
        }
      }, 1200);
    });

    // Live clear errors on input
    ['name', 'email', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.classList.remove('error');
          const errEl = document.getElementById(id + 'Error');
          if (errEl) errEl.textContent = '';
        });
      }
    });
  }

})();