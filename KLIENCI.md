# Перші клієнти: Варшава

Ролики лежать у папці `out/`. На кожному стоїть позначка «DEMO · wersja próbna», без неї клієнт отримує ролик лише після оплати.

## Кому відправляти

| # | Бізнес | Де | Ролик | Де знайти контакт |
|---|---|---|---|---|
| 1 | SPLIT Barbershop PL BY UA | Ursynów, ul. Pieskowa Skała 13 | `out/split-barbershop.mp4` | [Booksy](https://booksy.com/pl-pl/191802_split-barbershop-pl-by-ua_barber-shop_3_warszawa), потім їхній Instagram |
| 2 | Kulakov Barbershop | Ursynów / Zamienie | `out/kulakov-barbershop.mp4` | [сайт](https://kulakov.send-pulse.com/en) |
| 3 | Piękna Ty Beauty Salon | Wola | `out/piekna-ty.mp4` | [Booksy](https://booksy.com/pl-pl/109547_piekna-ty-beauty-salon_medycyna-estetyczna_3_warszawa), Instagram @pieknaty_irena |
| 4 | Будь-яка кав'ярня | будь-де | `out/kawiarnia-szablon.mp4` | змініть назву й адресу в `demo/leads.json` і перезапустіть рендер |

**Перед відправкою** перевірте на сторінці бізнесу, чи актуальні ціна, рейтинг і години роботи. Дані взяті з публічних сторінок, але могли змінитися.

## Повідомлення (Instagram DM / WhatsApp)

**Польською (для всіх):**
> Dzień dobry! 👋 Przygotowałem dla [NAZWA] krótki film promocyjny do Reels/TikTok (15 sek.). Przesyłam w załączniku – całkowicie za darmo, bez zobowiązań.
> Jeśli się podoba, mogę przygotować wersję bez znaku „DEMO” albo pakiet filmów na każdy miesiąc (np. 4 rolki – 400 zł).
> Pozdrawiam, [Ваше ім'я]

**Українською (якщо власник з України, наприклад SPLIT «PL BY UA»):**
> Добрий день! 👋 Зробив для [НАЗВА] короткий рекламний ролик для Reels і TikTok, надсилаю безкоштовно. Якщо сподобається, зроблю версію без позначки «DEMO» або пакет на місяць: 4 ролики за 400 zł. Гарного дня!

## Ціни
- 1 ролик без позначки DEMO: 100–150 zł
- 4 ролики на місяць: 400 zł
- 8 роликів на місяць: 700 zł

## Як зробити новий ролик
1. Додайте блок у `demo/leads.json`: назву, хук, 3 переваги, кольори.
2. `node demo/render.js <id>` (рендер займає близько 25 секунд).
3. Готовий файл з'явиться в `out/<id>.mp4`.

Щоб прибрати позначку DEMO після оплати, додайте в блок `video` поле `"watermark": false`.

## Щоденна норма
20 повідомлень на день. Якщо приблизно 1 з 20 погоджується, за тиждень матимете 5–7 платних замовлень.
