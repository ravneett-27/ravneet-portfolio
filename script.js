const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Header shadow/shrink once the page has scrolled
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

// Scroll-reveal: fade+rise elements into view as the page is scrolled
const revealTargets = document.querySelectorAll(
  ['.home-about-visual', '.home-about-copy > *', '.section-heading', '.work-card',
    '.contact-section > *:not(.contact-form)', '.form-row', '.form-submit-row',
    '.cs-section-head', '.cs-prose', '.cs-figure', '.cs-pullquote',
    '.cs-persona-grid > *', '.cs-gallery > *', '.cs-swatches > *',
    '.cs-meta > div', '.cs-next > *'].join(',')
);

if (revealTargets.length) {
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${(i % 4) * 90}ms`;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
}

// Custom cursor (pointer devices only)
if (window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('has-custom-cursor');

  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  requestAnimationFrame(animateRing);

  const hoverTargets = 'a, button, input, textarea, .work-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) cursorRing.classList.add('is-active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) cursorRing.classList.remove('is-active');
  });
}

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector('.form-status');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    if (status) {
      status.textContent = 'Sending…';
      status.className = 'form-status';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        contactForm.reset();
        if (status) {
          status.textContent = "Thanks — I'll get back to you soon.";
          status.classList.add('is-success');
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      if (status) {
        status.textContent = 'Something went wrong — please try emailing me directly.';
        status.classList.add('is-error');
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}
