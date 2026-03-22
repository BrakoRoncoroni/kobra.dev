/* ============================================================
   KobraDevelopment — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
        Tracks mouse position with a lagging ring effect.
        Grows on interactive elements.
        Disabled on touch/mobile devices.
     ---------------------------------------------------------- */
  const cursor    = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  const isTouchDevice = () =>
    window.matchMedia('(max-width: 768px)').matches ||
    ('ontouchstart' in window) ||
    navigator.maxTouchPoints > 0;

  if (!isTouchDevice() && cursor && cursorRing) {
    let mx = 0, my = 0;   // mouse position
    let rx = 0, ry = 0;   // ring position (lagged)

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    // Smooth lag animation for the ring
    function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Enlarge ring on interactive elements
    const interactives = document.querySelectorAll(
      'a, button, .service-card, .project-card'
    );

    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width   = '56px';
        cursorRing.style.height  = '56px';
        cursorRing.style.opacity = '0.9';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width   = '36px';
        cursorRing.style.height  = '36px';
        cursorRing.style.opacity = '0.5';
      });
    });
  }

  /* ----------------------------------------------------------
     2. MOBILE NAV TOGGLE
        Opens/closes the full-screen mobile menu.
     ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      // Prevent background scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK ON SCROLL
        Highlights the nav link corresponding to the current
        visible section as the user scrolls.
     ---------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let currentId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navAnchors.forEach((anchor) => {
      anchor.classList.remove('active');
      if (anchor.getAttribute('href') === '#' + currentId) {
        anchor.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // run once on load

  /* ----------------------------------------------------------
     4. SCROLL REVEAL
        Uses IntersectionObserver to animate elements with
        the .reveal class into view as they enter the viewport.
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire only once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL FOR ANCHOR LINKS
        Provides smooth scrolling while offsetting for the
        fixed navbar height.
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = document.querySelector('nav')?.offsetHeight || 80;
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     6. TICKER PAUSE ON HOVER
        Pauses the scrolling ticker when the user hovers over
        it, allowing them to read the items.
     ---------------------------------------------------------- */
  const ticker = document.querySelector('.ticker');

  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

});
