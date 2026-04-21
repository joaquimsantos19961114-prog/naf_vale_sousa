/**
 * NAF Vale do Sousa — Cookie Consent Banner
 * Informs users about third-party cookies (Google Fonts, Google Maps, EmailJS, Cloudinary).
 * Stores the user's choice in localStorage so the banner only appears once.
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'naf_cookie_consent';
    var CONSENT_VERSION = '1'; // Increment this to re-show the banner after policy changes

    function getConsent() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;
            var data = JSON.parse(stored);
            return data.version === CONSENT_VERSION ? data.value : null;
        } catch (e) {
            return null;
        }
    }

    function saveConsent(value) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                version: CONSENT_VERSION,
                value: value,
                date: new Date().toISOString()
            }));
        } catch (e) { /* silent fail */ }
    }

    function removeBanner(banner) {
        banner.classList.add('cookie-banner--hiding');
        banner.addEventListener('transitionend', function () {
            banner.remove();
        }, { once: true });
        // Safety fallback in case transitionend doesn't fire
        setTimeout(function () {
            if (banner && banner.parentNode) banner.remove();
        }, 700);
    }

    function createBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'false');
        banner.setAttribute('aria-label', 'Aviso de cookies');

        banner.innerHTML = [
            '<div class="cookie-banner__inner">',
            '  <div class="cookie-banner__icon" aria-hidden="true">',
            '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
            '      <circle cx="12" cy="12" r="10"/>',
            '      <circle cx="8.5"  cy="10.5" r="1" fill="currentColor" stroke="none"/>',
            '      <circle cx="14"   cy="9"     r="0.8" fill="currentColor" stroke="none"/>',
            '      <circle cx="15"   cy="14"    r="1.1" fill="currentColor" stroke="none"/>',
            '      <circle cx="9.5"  cy="15"    r="0.9" fill="currentColor" stroke="none"/>',
            '    </svg>',
            '  </div>',
            '  <div class="cookie-banner__content">',
            '    <p class="cookie-banner__title">Este site usa cookies de terceiros</p>',
            '    <p class="cookie-banner__text">',
            '      Usamos serviços externos — <strong>Google Fonts</strong>, <strong>Google Maps</strong>,',
            '      <strong>EmailJS</strong> e <strong>Cloudinary</strong> — que podem guardar cookies técnicas',
            '      no seu browser. Não utilizamos cookies de rastreio ou publicidade.',
            '    </p>',
            '  </div>',
            '  <div class="cookie-banner__actions">',
            '    <button id="cookieBannerAccept" class="cookie-banner__btn cookie-banner__btn--accept">',
            '      Aceitar',
            '    </button>',
            '    <button id="cookieBannerInfo" class="cookie-banner__btn cookie-banner__btn--info" aria-expanded="false" aria-controls="cookieBannerDetails">',
            '      Saber mais',
            '    </button>',
            '  </div>',
            '</div>',
            '<div id="cookieBannerDetails" class="cookie-banner__details" hidden>',
            '  <h3 class="cookie-banner__details-title">Que cookies são utilizadas?</h3>',
            '  <ul class="cookie-banner__list">',
            '    <li>',
            '      <strong>Google Fonts</strong> — carrega tipografia do servidor do Google,',
            '      que pode registar o endereço IP e browser para efeitos de segurança.',
            '    </li>',
            '    <li>',
            '      <strong>Google Maps</strong> — mapa incorporado na página de contactos.',
            '      O Google pode colocar cookies funcionais para gerir o mapa.',
            '    </li>',
            '    <li>',
            '      <strong>EmailJS</strong> — serviço de envio de formulários de contacto e inscrições.',
            '      Utiliza o browser apenas para autenticar e enviar o email.',
            '    </li>',
            '    <li>',
            '      <strong>Cloudinary</strong> — serviço de alojamento das imagens da galeria de eventos.',
            '      As imagens são servidas a partir dos servidores da Cloudinary.',
            '    </li>',
            '  </ul>',
            '  <p class="cookie-banner__details-note">',
            '    Todas as cookies são de carácter <strong>técnico/funcional</strong>.',
            '    Não recolhemos nem partilhamos dados pessoais para fins publicitários.',
            '  </p>',
            '</div>'
        ].join('\n');

        return banner;
    }

    function init() {
        // Don't show if already consented
        if (getConsent() !== null) return;

        var banner = createBanner();
        document.body.appendChild(banner);

        // Slide-in after a short delay so the CSS transition fires
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                banner.classList.add('cookie-banner--visible');
            });
        });

        // Accept button
        var acceptBtn = document.getElementById('cookieBannerAccept');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function () {
                saveConsent('accepted');
                removeBanner(banner);
            });
        }

        // "Saber mais" toggle
        var infoBtn = document.getElementById('cookieBannerInfo');
        var detailsEl = document.getElementById('cookieBannerDetails');
        if (infoBtn && detailsEl) {
            infoBtn.addEventListener('click', function () {
                var isOpen = !detailsEl.hidden;
                detailsEl.hidden = isOpen;
                infoBtn.setAttribute('aria-expanded', String(!isOpen));
                infoBtn.textContent = isOpen ? 'Saber mais' : 'Fechar';
            });
        }
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
