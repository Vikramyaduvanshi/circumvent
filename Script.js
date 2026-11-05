(function () {
  'use strict';

  /* ---------- CONFIG: apni WhatsApp number yahan daalein (country code ke saath, bina + ke) ---------- */
  var WHATSAPP_NUMBER = '91XXXXXXXXXX'; // sirf floating WhatsApp button ke liye

  /* ---------- Contact form ki email API ---------- */
  var EMAIL_API_URL = 'https://portfolio-email-sender-xf1x.onrender.com/sendemail';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');

  /* ---------- Sticky header + back-to-top ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 30);
    toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    burger.classList.remove('open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = burger.classList.toggle('open');
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMenu();
  });

  /* ---------- Service filter tabs ---------- */
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('#serviceGrid .card');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.toggle('hide', !show);
        card.classList.remove('pop');
        if (show) {
          void card.offsetWidth; // restart animation
          card.classList.add('pop');
        }
      });
    });
  });

  /* ---------- Card spotlight follows cursor ---------- */
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Counter animation ---------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(p * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Contact form -> Email API ---------- */
  var form = document.getElementById('contactForm');
  var errBox = document.getElementById('formError');
  var okBox = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');
  var btnText = document.getElementById('btnText');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errBox.textContent = '';
    okBox.textContent = '';

    var name = document.getElementById('fName').value.trim();
    var email = document.getElementById('fEmail').value.trim();
    var phone = document.getElementById('fPhone').value.trim();
    var service = document.getElementById('fService').value;
    var msg = document.getElementById('fMsg').value.trim();

    if (!name || !email || !phone || !service) {
      errBox.textContent = 'Please fill your name, email, phone number and select a service.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errBox.textContent = 'Please enter a valid email address.';
      return;
    }
    if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
      errBox.textContent = 'Please enter a valid phone number.';
      return;
    }

    /* Backend ko jo fields chahiye unke hisaab se yahan keys badal sakte hain */
    var data = {
      name: name,
      email: email,
      phone: phone,
      service: service,
      subject: 'New enquiry: ' + service,
      message: msg || 'No additional message.'
    };

    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    try {
      var response = await fetch(EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Server responded with ' + response.status);
      }

      okBox.textContent = 'Thank you! Your message has been sent. We will contact you soon.';
      form.reset();
    } catch (err) {
      errBox.textContent = 'Sorry, message could not be sent. Please try again in a moment.';
      console.error('Email send failed:', err);
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
    }
  });

  /* ---------- Floating WhatsApp button ---------- */
  var wa = document.getElementById('waFloat');
  wa.href = 'https://wa.me/' + 8178738926 + '?text=' + encodeURIComponent('Hello Circumvent AI, I want to know more about your services.');

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();