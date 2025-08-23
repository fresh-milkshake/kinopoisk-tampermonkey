## Что это?

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-100000?style=for-the-badge&logo=tampermonkey&logoColor=white)
![Greasyfork](https://img.shields.io/badge/Greasyfork-100000?style=for-the-badge&logo=greasyfork&logoColor=white)

Простейший скрипт для [Кинопоиска](https://www.kinopoisk.ru/), добавляющий кнопку "Смотреть сейчас" с кастомной ссылкой. Позволяет быстро переходить на страницу просмотра фильма/сериала на иных сайтах.

<figure>
  <img src="assets/before.png" alt="before" width="500">
  <figcaption>До установки скрипта</figcaption>
</figure>


<figure>
  <img src="assets/after.png" alt="after" width="500">
  <figcaption>После установки скрипта</figcaption>
</figure>

## Использование

1. Установите расширение [Tampermonkey](https://www.tampermonkey.net/) для вашего браузера.
2. Перейдите по ссылке на скрипт [на сайте Greasyfork](https://greasyfork.org/ru/scripts/542571-%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0-%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C-%D0%B4%D0%BB%D1%8F-%D0%BA%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0) и нажмите "Установить".
3. Рядом с кнопкой "Буду смотреть" появится новая кнопка "Смотреть сейчас". При нажатии на неё откроется страница с тем же адресом, но на домене, который вы указали (по умолчанию — `sspoisk.ru`).

## Кастомизация

Редактировать домен можно в файле `script.js` в строке `const DEFAULT_REPLACE_DOMAIN = 'sspoisk.ru';`. Тут можно указать любой домен, который будет использоваться для замены оригинального `kinopoisk.ru`.

## Лицензия

Это чудо распространяется под лицензией MIT. См. файл [LICENSE](LICENSE.txt) для подробностей.