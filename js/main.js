// Verdelle Privacy Policy: theme toggle, mobile contents menu, active section
// highlighting, reveal-on-scroll and back-to-top. No tracking, no network calls.
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  // Theme ---------------------------------------------------------------
  var themeButton = document.querySelector('.theme-toggle');
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      updateThemeLabel();
    });
  }
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener('change', updateThemeLabel);
  updateThemeLabel();

  // Mobile contents menu --------------------------------------------------
  var toc = document.getElementById('toc');
  var navToggle = document.querySelector('.nav-toggle');

  function setMenu(open) {
    if (!toc || !navToggle) return;
    toc.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close contents' : 'Open contents');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setMenu(!toc.classList.contains('open'));
    });
  }
  if (toc) {
    toc.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toc && toc.classList.contains('open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Active section in the contents ---------------------------------------
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  function pickActive() {
    var offset = 140;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top - offset <= 0) current = sections[i];
    }
    // At the very bottom, the last section is the one being read.
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    if (current) setActive(current.id);
  }

  // Header border, back-to-top -----------------------------------------
  var header = document.querySelector('.site-header');
  var backToTop = document.querySelector('.back-to-top');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 8);
      if (backToTop) backToTop.classList.toggle('visible', y > 600);
      pickActive();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', location.pathname + location.search);
      var brand = document.querySelector('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  // Reveal on scroll -----------------------------------------------------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
  // A linked section (e.g. /#contact) must be visible straight away.
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (target && target.classList.contains('reveal')) target.classList.add('in');
  }
})();
