const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
