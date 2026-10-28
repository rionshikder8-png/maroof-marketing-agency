(function () {
  'use strict';
  var WA_NUM = '923190482228';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // year
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  // header scroll state
  var header = $('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
  var toggle = $('.menu-toggle'), panel = $('#nav-panel');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('open', open);
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); toggle.focus(); } });
  $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function () { setMenu(false); });

  // reveal on scroll
  var items = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (e) { io.observe(e); });
  }

  // 3D stage pointer tilt (CSS 3D, no WebGL needed)
  var stage = $('#stage');
  if (stage && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var ticking = false;
    stage.parentElement.parentElement.addEventListener('pointermove', function (e) {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var r = stage.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        var y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        stage.style.setProperty('--rx', (x * 22).toFixed(2));
        stage.style.setProperty('--ry', (y * 18).toFixed(2));
        ticking = false;
      });
    });
  }

  // portfolio filters
  var filters = $$('.filter');
  if (filters.length) {
    var cards = $$('#work-grid .work'), empty = $('#empty');
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        var f = b.dataset.filter, n = 0;
        cards.forEach(function (c) { var show = f === 'all' || c.dataset.cat === f; c.hidden = !show; if (show) { n++; c.classList.add('in'); } });
        empty.classList.toggle('show', n === 0);
      });
    });
  }

  // contact form -> WhatsApp (no fake submission)
  var form = $('#inquiry-form');
  if (form) {
    var status = $('#form-status');
    var qs = new URLSearchParams(location.search).get('service');
    if (qs) { var sel = $('#service'); $$('option', sel).forEach(function (o) { if (o.text === qs) sel.value = o.text; }); }
    function setErr(id, bad) { $('#' + id).closest('.field').classList.toggle('invalid', bad); $('#' + id).setAttribute('aria-invalid', bad); return bad; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return $('#' + id).value.trim(); };
      var bad = [
        setErr('name', v('name').length < 2),
        setErr('email', v('email') !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))),
        setErr('service', v('service') === ''),
        setErr('details', v('details').length < 10)
      ];
      if (bad.some(Boolean)) {
        var first = $('.field.invalid input, .field.invalid select, .field.invalid textarea');
        if (first) first.focus();
        status.className = 'form-status'; status.textContent = ''; return;
      }
      var lines = ['*New Project Inquiry - Maroof Marketing Agency*', '',
        'Name: ' + v('name'), 'Service: ' + v('service')];
      if (v('business')) lines.push('Business: ' + v('business'));
      if (v('email')) lines.push('Email: ' + v('email'));
      if (v('phone')) lines.push('Contact number: ' + v('phone'));
      if (v('budget')) lines.push('Estimated budget: ' + v('budget'));
      lines.push('', 'Project details:', v('details'));
      var msg = lines.join('\n');
      var url = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(msg);
      status.className = 'form-status show';
      status.innerHTML = '<strong>Your inquiry has NOT been sent yet.</strong> WhatsApp should open with your message ready. Press <strong>Send</strong> in WhatsApp to deliver it. If nothing opens, <a href="' + url + '" target="_blank" rel="noopener">open WhatsApp here</a> or copy the message below.<textarea readonly aria-label="Prepared inquiry message"></textarea>';
      $('textarea', status).value = msg;
      var w = window.open(url, '_blank', 'noopener');
      if (!w) status.classList.add('warn');
    });
    $$('input,select,textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { el.closest('.field').classList.remove('invalid'); });
    });
  }
})();
