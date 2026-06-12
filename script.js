// ==UserScript==
// @name         Кнопка "Смотреть сейчас" для кинопоиска
// @namespace    http://tampermonkey.net/
// @version      2026-06-12
// @description  Ищет фильм или сериал с Кинопоиска на Kinogo и Lordfilm через Google
// @author       @fresh-milkshake
// @match        https://www.kinopoisk.ru/*
// @match        https://www.google.com/search*
// @match        https://www.google.ru/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const SEARCH_MARKER = 'kinopoisk_watch_provider';
    const SEARCH_TIMEOUT_MS = 10000;
    const PROVIDERS = [
        {
            id: 'kinogo',
            label: 'Смотреть (Kinogo)',
            color: '#ff8000',
            textColor: '#ffffff',
        },
        {
            id: 'lordfilm',
            label: 'Lordfilm',
            color: '#242424',
            textColor: '#ffffff',
        },
    ];

    function isGoogleSearchPage() {
        return /^www\.google\.(com|ru)$/i.test(window.location.hostname)
            && window.location.pathname === '/search';
    }

    function isKinopoiskPage() {
        return window.location.hostname === 'www.kinopoisk.ru';
    }

    function getSelectedProvider() {
        const providerId = new URLSearchParams(window.location.search).get(SEARCH_MARKER);
        return PROVIDERS.find((provider) => provider.id === providerId) || null;
    }

    function extractDestinationUrl(href) {
        try {
            const url = new URL(href, window.location.origin);
            if (/^www\.google\.(com|ru)$/i.test(url.hostname) && url.pathname === '/url') {
                const destination = url.searchParams.get('url') || url.searchParams.get('q');
                return destination ? new URL(destination).href : null;
            }

            if (/^www\.google\.(com|ru)$/i.test(url.hostname)) {
                return null;
            }

            if (!['http:', 'https:'].includes(url.protocol)) {
                return null;
            }

            return url.href;
        } catch (_) {
            return null;
        }
    }

    function findFirstProviderResult(providerId) {
        const resultRoot = document.querySelector('#search');
        if (!resultRoot) return null;

        const resultLinks = Array.from(resultRoot.querySelectorAll('a[href]'))
            .filter((link) => link.querySelector('h3'));

        for (const link of resultLinks) {
            const destinationUrl = extractDestinationUrl(link.href);
            if (destinationUrl && destinationUrl.toLowerCase().includes(providerId)) {
                return destinationUrl;
            }
        }

        return null;
    }

    function redirectToFirstProviderResult() {
        const provider = getSelectedProvider();
        if (!provider) return;

        let redirected = false;
        let observer;

        const tryRedirect = () => {
            if (redirected) return;

            const destinationUrl = findFirstProviderResult(provider.id);
            if (!destinationUrl) return;

            redirected = true;
            if (observer) observer.disconnect();
            window.location.replace(destinationUrl);
        };

        observer = new MutationObserver(tryRedirect);
        observer.observe(document.documentElement, { childList: true, subtree: true });
        tryRedirect();

        window.setTimeout(() => observer.disconnect(), SEARCH_TIMEOUT_MS);
    }

    function getMovieTitle() {
        return document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || '';
    }

    function findWillWatchButton() {
        return Array.from(document.querySelectorAll('button, a, [role="button"]'))
            .find((element) => element.textContent?.replace(/\s+/g, ' ').trim() === 'Буду смотреть');
    }

    function createPlayIcon() {
        const playIcon = document.createElement('span');
        playIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        playIcon.style.display = 'inline-flex';
        playIcon.style.alignItems = 'center';
        playIcon.style.marginRight = '0.5rem';
        return playIcon;
    }

    function buildGoogleSearchUrl(title, providerId) {
        const searchUrl = new URL('https://www.google.com/search');
        searchUrl.searchParams.set('q', `${title} ${providerId}`);
        searchUrl.searchParams.set(SEARCH_MARKER, providerId);
        return searchUrl.href;
    }

    function createWatchButton(provider, nativeButton) {
        const button = document.createElement('button');
        button.className = nativeButton.className;
        button.type = 'button';
        button.title = `Найти на ${provider.id}`;
        button.dataset.kinopoiskWatchProvider = provider.id;

        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.backgroundColor = provider.color;
        button.style.color = provider.textColor;
        button.style.border = 'none';
        button.style.borderRadius = '5.2rem';
        button.style.padding = '1.4rem 1.8rem';
        button.style.marginRight = '0.6rem';
        button.style.cursor = 'pointer';
        button.style.whiteSpace = 'nowrap';

        if (provider.id === 'kinogo') {
            button.appendChild(createPlayIcon());
        }

        const text = document.createElement('span');
        text.textContent = provider.label;
        button.appendChild(text);

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const title = getMovieTitle();
            if (!title) return;

            window.open(buildGoogleSearchUrl(title, provider.id), '_blank', 'noopener,noreferrer');
        });

        return button;
    }

    function addWatchButtons() {
        const title = getMovieTitle();
        const willWatchButton = findWillWatchButton();
        const buttonsContainer = willWatchButton?.closest('[class*="buttonsContainer"]')
            || document.querySelector('[class*="buttonsContainer"]');

        if (!title || !buttonsContainer || !willWatchButton) return;
        if (buttonsContainer.querySelector('[data-kinopoisk-watch-provider]')) return;

        const fragment = document.createDocumentFragment();
        for (const provider of PROVIDERS) {
            fragment.appendChild(createWatchButton(provider, willWatchButton));
        }

        buttonsContainer.insertBefore(fragment, buttonsContainer.firstChild);
    }

    function observeKinopoiskPage() {
        const observer = new MutationObserver(addWatchButtons);
        observer.observe(document.body, { childList: true, subtree: true });
        addWatchButtons();
    }

    if (isGoogleSearchPage()) {
        redirectToFirstProviderResult();
    } else if (isKinopoiskPage()) {
        observeKinopoiskPage();
    }
})();
