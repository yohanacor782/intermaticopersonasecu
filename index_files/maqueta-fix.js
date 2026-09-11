(function () {
    var HOST = 'https://www.bancodelpacifico.com';

    var IMAGE_MAP = {
        'bancavirtual-personas.jpg': HOST + '/BancoPacifico/media/layout-images/bancavirtual-personas.jpg',
        'bancavirtual-empresa.jpg': HOST + '/BancoPacifico/media/layout-images/bancavirtual-empresa.jpg',
        'bancavirtual-establecimiento.jpg': HOST + '/BancoPacifico/media/layout-images/bancavirtual-establecimiento.jpg',
        'mi-banco.gif': HOST + '/BancoPacifico/media/layout-images/mi-banco.gif',
        'cuenta-mi-ahorro-cuenta-adulto.jpg': HOST + '/BancoPacifico/media/Personas/Cuentas%20y%20Tarjetas/cuenta-mi-ahorro-cuenta-adulto.jpg',
        'BDP-KG-Banner-Finalsq.png': HOST + '/BancoPacifico/media/BannersHome/2026/BDP-KG-Banner-Finalsq.png',
        'banner-biess-mobile.jpg': HOST + '/BancoPacifico/media/BannersHome/2026/banner-biess-mobile.jpg',
        'banner-mobile-mi-casa-propia.jpg': HOST + '/BancoPacifico/media/BannersHome/2026/banner-mobile-mi-casa-propia.jpg',
        'banner-mobile-institucional.png': HOST + '/BancoPacifico/media/BannersHome/2026/banner-mobile-institucional.png',
        'deposito-a-plazo.png': HOST + '/BancoPacifico/media/BannersPersonas/deposito-a-plazo.png',
        'banner-ahorro-programado.png': HOST + '/BancoPacifico/media/BannersPersonas/banner-ahorro-programado.png',
        'Logo-Banco-con-ISO-2025-2.png': HOST + '/BancoPacifico/media/layout-images/Logo-Banco-con-ISO-2025-2.png',
        'cursor-icon.png': HOST + '/BancoPacifico/media/layout-images/icons/cursor-icon.png',
        'apps.png': HOST + '/BancoPacifico/media/layout-images/icons/apps.png',
        'icon-banca-movil.png': HOST + '/BancoPacifico/media/layout-images/icon-banca-movil.png',
        'banner-aprende.png': HOST + '/BancoPacifico/media/Personas/banner-aprende.png',
        'cosede.jpg': HOST + '/BancoPacifico/media/Personas/cosede.jpg',
        'plataforma-educate.jpg': HOST + '/BancoPacifico/media/Personas/plataforma-educate.jpg',
        'control-de-finanzas.jpg': HOST + '/BancoPacifico/media/Personas/control-de-finanzas.jpg',
        'BANNER-UAFE.jpg': HOST + '/BancoPacifico/media/Personas/BANNER-UAFE.jpg',
        'popup-credito-mi-casa-propia.gif': HOST + '/BancoPacifico/media/layout-images/popup/popup-credito-mi-casa-propia.gif'
    };

    function fileName(src) {
        return (src || '').split('/').pop().split('?')[0];
    }

    function absMedia(path) {
        if (!path) return path;
        var clean = path.replace(/&amp;/g, '&').split('?')[0].trim();
        var idx = clean.indexOf('/BancoPacifico/');
        if (idx !== -1) return HOST + clean.slice(idx);
        return path;
    }

    function applyDataBg() {
        var nodes = document.querySelectorAll('[data-bg]');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var bg = el.getAttribute('data-bg');
            if (!bg) continue;
            el.style.backgroundImage = 'url("' + absMedia(bg) + '")';
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center center';
            el.style.backgroundRepeat = 'no-repeat';
        }
    }

    function fixInlineBackgrounds() {
        var nodes = document.querySelectorAll('[style]');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var style = el.getAttribute('style');
            if (!style || style.indexOf('/BancoPacifico/') === -1) continue;
            var match = style.match(/url\((?:['"]|&(?:#39|quot);)?(\/BancoPacifico\/[^)'"\s]+)/);
            if (!match) continue;
            var url = absMedia(match[1]);
            el.style.backgroundImage = 'url("' + url + '")';
            el.style.backgroundSize = 'cover';
            el.style.backgroundRepeat = 'no-repeat';
        }
    }

    function fixImages() {
        var imgs = document.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) {
            (function (img) {
                var src = img.getAttribute('src') || '';
                var name = fileName(src);
                if (IMAGE_MAP[name]) {
                    img.src = IMAGE_MAP[name];
                    return;
                }
                if (src.indexOf('./index_files/') !== 0 && src.indexOf('index_files/') !== 0) return;
                img.addEventListener('error', function onErr() {
                    img.removeEventListener('error', onErr);
                    var candidates = [
                        HOST + '/BancoPacifico/media/BannersHome/2026/' + name,
                        HOST + '/BancoPacifico/media/BannersPersonas/' + name,
                        HOST + '/BancoPacifico/media/Personas/' + name,
                        HOST + '/BancoPacifico/media/layout-images/' + name,
                        HOST + '/BancoPacifico/media/layout-images/icons/' + name,
                        HOST + '/BancoPacifico/media/layout-images/popup/' + name
                    ];
                    var n = 0;
                    img.onerror = function () {
                        n += 1;
                        if (n < candidates.length) img.src = candidates[n];
                    };
                    img.src = candidates[0];
                });
            })(imgs[i]);
        }
    }

    function simpleSlider() {
        var root = document.querySelector('.slide.desktop');
        if (!root) return;
        var slides = root.querySelectorAll('ul li');
        if (!slides.length) return;

        var current = 0;
        for (var i = 0; i < slides.length; i++) {
            slides[i].style.opacity = i === 0 ? '1' : '0';
            slides[i].style.zIndex = i === 0 ? '2' : '1';
            slides[i].style.transition = 'opacity .8s ease';
        }

        function go(next) {
            slides[current].style.opacity = '0';
            slides[current].style.zIndex = '1';
            current = (next + slides.length) % slides.length;
            slides[current].style.opacity = '1';
            slides[current].style.zIndex = '2';
            var dots = root.querySelectorAll('.dots li');
            for (var d = 0; d < dots.length; d++) {
                dots[d].className = d === current ? 'active' : '';
            }
        }

        if (!root.querySelector('.dots')) {
            var dots = document.createElement('ul');
            dots.className = 'dots';
            for (var j = 0; j < slides.length; j++) {
                (function (idx) {
                    var dot = document.createElement('li');
                    if (idx === 0) dot.className = 'active';
                    dot.addEventListener('mouseenter', function () { go(idx); });
                    dots.appendChild(dot);
                })(j);
            }
            root.appendChild(dots);
        }

        if (slides.length > 1) {
            setInterval(function () { go(current + 1); }, 4000);
        }
    }

    function stubMissingPlugins() {
        if (!window.jQuery) return;
        if (!jQuery.fn.slide) {
            jQuery.fn.slide = function () { return this; };
        }
        if (!jQuery.fn.owlCarousel) {
            jQuery.fn.owlCarousel = function () { return this; };
        }
    }

    function boot() {
        stubMissingPlugins();
        applyDataBg();
        fixInlineBackgrounds();
        fixImages();
        simpleSlider();
    }

    stubMissingPlugins();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
