// ============================================================
// PLAZA LA CIMA — Shared site behavior
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  /* Mobile menu toggle */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  /* Navbar scrolled shadow */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Reveal on scroll */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* Animated stat counters */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterIO.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.counter + (el.dataset.suffix || ''); });
  }

  /* Lazy image shimmer removal */
  document.querySelectorAll('img.lazy-img').forEach(img => {
    if (img.complete) { img.classList.add('loaded'); return; }
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => img.classList.add('loaded'));
  });

  /* Store directory filter (stores.html) */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const storeCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && storeCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('btn-primary'));
        filterBtns.forEach(b => b.classList.add('btn-outline'));
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
        const filter = btn.dataset.filter;
        storeCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* Simple client-side form feedback (no backend) */
  document.querySelectorAll('form[data-static-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const successEl = form.querySelector('[data-form-success]');
      if (btn) {
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = 'Sending...';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = original;
          form.reset();
          if (successEl) {
            successEl.classList.remove('hidden');
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 900);
      }
    });
  });
});
