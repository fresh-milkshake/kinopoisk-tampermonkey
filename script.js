// ==UserScript==
// @name         Кнопка "Смотреть сейчас" для кинопоиска
// @namespace    http://tampermonkey.net/
// @version      2025-07-14
// @description  Добавляет кнопку "Смотреть сейчас" на странице сериала на кинопоиске
// @author       @grut
// @match        https://www.kinopoisk.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @grant        none
// ==/UserScript==

(function() {
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
     * Добавляет кнопку "Смотреть" рядом с "Буду смотреть".
     */
    function addWatchButton() {
        // Ищем оригинальную кнопку
        const originalBtnSelector = 'button.style_button__PNtXT.style_buttonSize52__b5OBe.style_buttonPrimary__ndPAb.style_buttonLight____6ma.style_withIconLeft___Myt9[title="Буду смотреть"]';
        const originalBtn = document.querySelector(originalBtnSelector);
        if (!originalBtn) return;

        // Контейнеры
        const rootContainer = originalBtn.closest('.style_root__BmiQ7');
        if (!rootContainer) return;
        const outerContainer = rootContainer.parentElement;
        if (!outerContainer || !outerContainer.classList.contains('styles_button__tQYKG')) return;

        // Уже добавлено?
        if (
            outerContainer.nextSibling &&
            outerContainer.nextSibling.nodeType === 1 &&
            outerContainer.nextSibling.dataset &&
            outerContainer.nextSibling.dataset.sspoiskBlock === 'true'
        ) {
            return;
        }

        // Клонируем контейнер
        const newOuter = outerContainer.cloneNode(true);

        // Меняем кнопку внутри клона
        const newRoot = newOuter.querySelector('.style_root__BmiQ7');
        if (!newRoot) return;
        const newBtn = newRoot.querySelector('button');
        if (!newBtn) return;

        // Атрибуты и текст
        const label = "Смотреть сейчас";
        newBtn.title = label;
        newBtn.innerHTML = label;
        newBtn.setAttribute('aria-pressed', 'false');
        newBtn.dataset.sspoiskBtn = 'true';

        // Текст в последнем span
        const spanList = newBtn.querySelectorAll('span');
        if (spanList.length > 0) {
            spanList[spanList.length - 1].textContent = label;
        } else {
            newBtn.textContent = label;
        }

        // Стили
        newBtn.style.backgroundColor = '#ff8000';
        newBtn.style.color = '#fff';
        newBtn.style.borderColor = '#ff8000';

        // Клик — открыть sspoisk.ru
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const newUrl = replaceKinopoiskDomain(window.location.href, DEFAULT_REPLACE_DOMAIN);
            window.open(newUrl, '_blank');
        });

        // Пометка, чтобы не дублировать
        newOuter.dataset.sspoiskBlock = 'true';

        // Вставка после оригинала
        outerContainer.parentNode.insertBefore(newOuter, outerContainer.nextSibling);
    }

    // Следим за DOM (SPA)
    const observer = new MutationObserver(() => {
        addWatchButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Добавляем сразу, если кнопка уже есть
    addWatchButton();
})();