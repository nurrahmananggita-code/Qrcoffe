document.documentElement.classList.add("js");

(function () {
    "use strict";

    /* ---------- 1. Elemen muncul saat masuk layar ---------- */
    var targets = document.querySelectorAll("[data-reveal]");

    if ("IntersectionObserver" in window && targets.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                var el = entry.target;
                el.style.transitionDelay = (el.dataset.revealDelay || 0) + "ms";
                el.classList.add("is-in");
                observer.unobserve(el);
            });
        }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });

        targets.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        targets.forEach(function (el) {
            el.classList.add("is-in");
        });
    }

    /* ---------- 2. Foto latar bergerak lebih lambat ---------- */
    var layers = document.querySelectorAll("[data-parallax]");

    if (!layers.length) {
        return;
    }

    var scroller = document.querySelector(".app-body") || window;
    var pending = false;

    function update() {
        var offset = scroller === window ? window.scrollY : scroller.scrollTop;

        layers.forEach(function (el) {
            var speed = Number(el.dataset.parallax) || 0.14;
            var geser = Math.min(offset * speed, 46);
            el.style.transform = "translate3d(0," + geser + "px,0)";
        });

        pending = false;
    }

    function onScroll() {
        if (pending) {
            return;
        }

        pending = true;
        window.requestAnimationFrame(update);
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    update();
})();

/* EFEK HOVER DI HP: saat disentuh, kartu "menyala" sebentar */
document.addEventListener("touchstart", function (event) {
    const target = event.target.closest(".menu-link, .chip, .ai-card");

    if (!target) {
        return;
    }

    target.classList.add("is-hover");

    setTimeout(function () {
        target.classList.remove("is-hover");
    }, 700);
}, { passive: true });