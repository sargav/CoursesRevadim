/* ============================================================
   רבדים – הפעלת האנימציות (animations.css)
   ============================================================ */
(function () {
    // מי שביקש במכשיר להפחית תנועה, או דפדפן ישן: לא מפעילים כלום
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    // החלק העליון של העמוד: לוגו, כותרת ותת-כותרת
    var INTRO = '.logo-area, .hero-logo, .brand-logo, .main-intro, .hero-title, .main-title, .hero-sub, .sub-title';

    // מה שמופיע בגלילה
    var REVEAL = [
        '.course-link-block', '.professional-profile-area', '.nav-headline',
        '.question-card', '.info-card', '.lesson-card', '.outcome-item', '.resp-card',
        '.method-item-box', '.block-box', '.timeline-item', '.testimonial-card',
        '.detail-item', '.stat-block',
        '.section-title-modern', '.section-title', '.info-title', '.resp-title',
        '.manifesto-heading', '.intro-lead'
    ].join(', ');

    var STAGGER = 0.08;   // שניות בין כרטיסים צמודים
    var MAX_DELAY = 0.4;  // לא לחכות יותר מזה לכרטיס אחד

    document.documentElement.classList.add('anim-ready');

    document.querySelectorAll(INTRO).forEach(function (el, i) {
        el.style.setProperty('--anim-delay', (i * 0.12) + 's');
        el.classList.add('anim-intro');
        el.addEventListener('animationend', function () {
            el.classList.remove('anim-intro');
            el.style.removeProperty('--anim-delay');
        }, { once: true });
    });

    var items = Array.prototype.filter.call(document.querySelectorAll(REVEAL), function (el) {
        return !el.closest('.anim-intro');
    });

    // השהיה מדורגת לאחים באותה רשת, כדי שכרטיסים יופיעו אחד אחרי השני
    items.forEach(function (el) {
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (s) {
            return items.indexOf(s) !== -1;
        });
        var delay = Math.min(siblings.indexOf(el) * STAGGER, MAX_DELAY);
        el.style.setProperty('--anim-delay', delay + 's');
        el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            observer.unobserve(el);
            el.classList.add('is-visible');
            // בסוף ההופעה מחזירים לאלמנט את העיצוב המקורי שלו (כולל אפקטי ריחוף)
            el.addEventListener('transitionend', function done(e) {
                if (e.target !== el || e.propertyName !== 'transform') return;
                el.removeEventListener('transitionend', done);
                el.classList.remove('reveal', 'is-visible');
                el.style.removeProperty('--anim-delay');
            });
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
})();
