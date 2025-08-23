// ==UserScript==
// @name         Кнопка "Смотреть сейчас" для кинопоиска
// @namespace    http://tampermonkey.net/
// @version      2025-08-23
// @description  Добавляет кнопку "Смотреть сейчас" на странице сериала на кинопоиске
// @author       @fresh-milkshake
// @match        https://www.kinopoisk.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_REPLACE_DOMAIN = 'sspoisk.ru';

    /**
     * Заменяет домен kinopoisk.ru на указанный.
     * @param {string} url - исходный URL
     * @param {string} templateDomain - новый домен
     * @returns {string}
     */
    function replaceKinopoiskDomain(url, templateDomain) {
        return url
            .replace('www.kinopoisk.ru', 'www.' + templateDomain)
            .replace('kinopoisk.ru', templateDomain);
    }

    /**
     * Добавляет кнопку "Смотреть" в контейнер с кнопками.
     */
    function addWatchButton() {
        // Ищем контейнер с кнопками
        const buttonsContainer = document.querySelector('.styles_buttonsContainer__Kcrch');
        if (!buttonsContainer) return;

        // Уже добавлено?
        if (buttonsContainer.querySelector('[data-sspoisk-btn="true"]')) {
            return;
        }

        // Создаем новую кнопку
        const newBtn = document.createElement('button');
        newBtn.className = 'style_button__Awsrq style_buttonSize52__MBeHC style_buttonPrimary__Qn_9l style_buttonLight__C8cK7 style_withIconLeft__USlpL';
        newBtn.title = 'Смотреть сейчас';
        newBtn.setAttribute('aria-pressed', 'false');
        newBtn.dataset.sspoiskBtn = 'true';

        // Создаем иконку play
        const playIcon = document.createElement('span');
        playIcon.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        playIcon.style.marginRight = '0.5rem';
        playIcon.style.display = 'inline-flex';
        playIcon.style.alignItems = 'center';

        // Создаем текст
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Смотреть сейчас';

        // Добавляем иконку и текст в кнопку
        newBtn.appendChild(playIcon);
        newBtn.appendChild(textSpan);

        // Стили
        newBtn.style.backgroundColor = '#ff8000';
        newBtn.style.color = '#fff';
        newBtn.style.border = 'none';
        newBtn.style.borderRadius = '5.2rem';
        // padding
        newBtn.style.paddingBlockStart = '1.4rem';
        newBtn.style.paddingBlockEnd = '1.4rem';
        newBtn.style.paddingInlineStart = '2.2rem';
        newBtn.style.paddingInlineEnd = '2.6rem';
        // margin
        newBtn.style.marginRight = '1rem';

        // Клик — открыть sspoisk.ru
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const newUrl = replaceKinopoiskDomain(window.location.href, DEFAULT_REPLACE_DOMAIN);
            window.open(newUrl, '_blank');
        });

        // Добавляем кнопку в начало контейнера
        buttonsContainer.insertBefore(newBtn, buttonsContainer.firstChild);
    }

    // Следим за DOM (SPA)
    const observer = new MutationObserver(() => {
        addWatchButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Добавляем сразу, если кнопка уже есть
    addWatchButton();
})();