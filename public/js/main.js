(function () {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.getAttribute('data-filter');

                filterBtns.forEach(function (b) {
                    b.classList.remove('is-active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('is-active');
                btn.setAttribute('aria-pressed', 'true');

                projectCards.forEach(function (card) {
                    var matches = filter === 'all' || card.getAttribute('data-category') === filter;
                    card.classList.toggle('is-filtered-out', !matches);
                });
            });
        });
    }

    var fadeEls = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window && fadeEls.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeEls.forEach(function (el) { observer.observe(el); });
    } else {
        fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
})();
