(function() {
  'use strict';

  // Sidebar
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const openBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');

  if (sidebar && overlay && openBtn && closeBtn) {
    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    openBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
    });
  }

  // Copy buttons on code blocks
  document.querySelectorAll('.markdown pre').forEach(function(pre) {
    // Skip if it's a copy button or already has one
    if (pre.querySelector('.copy-btn')) return;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';

    btn.addEventListener('click', function() {
      var code = pre.querySelector('code');
      var text = code ? code.textContent : pre.textContent;

      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      }).catch(function() {
        btn.textContent = 'Error';
        setTimeout(function() {
          btn.textContent = 'Copy';
        }, 1500);
      });
    });

    pre.appendChild(btn);
  });

  // Header anchor links
  document.querySelectorAll('.markdown h1, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6').forEach(function(header) {
    var id = header.textContent
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!id) return;
    header.id = id;

    var anchor = document.createElement('button');
    anchor.className = 'header-anchor';
    anchor.textContent = '#';
    anchor.setAttribute('aria-label', 'Copy link to section');

    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var url = window.location.origin + window.location.pathname + '#' + id;

      navigator.clipboard.writeText(url).then(function() {
        anchor.classList.add('copied');
        setTimeout(function() { anchor.classList.remove('copied'); }, 1000);
        history.replaceState(null, null, '#' + id);
      }).catch(function() {
        history.replaceState(null, null, '#' + id);
      });

      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    header.appendChild(anchor);
  });

  // Hash navigation on load
  if (window.location.hash) {
    var target = document.getElementById(window.location.hash.substring(1));
    if (target) {
      setTimeout(function() {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }

  // Highlight active sidebar link on scroll
  var observeLinks = document.querySelectorAll('.sidebar-link');
  if (observeLinks.length && window.IntersectionObserver) {
    var headings = document.querySelectorAll('.markdown h1, .markdown h2, .markdown h3');
    if (headings.length) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            // Could update sidebar active state here if needed
          }
        });
      }, { rootMargin: '-80px 0px -80% 0px' });
      headings.forEach(function(h) { observer.observe(h); });
    }
  }
})();
