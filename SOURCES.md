# Источники, лицензии и границы точности

Независимый демонстрационный проект. Не официальный конфигуратор Cadillac.
Источники проверены при подготовке проекта; цены и оснащение меняются.

## Характеристики

- Cadillac, Escalade-V 2027: https://www.cadillac.com/suv/escalade/v-series — 682 hp, 653 lb-ft, 6.2L Supercharged V8, оценка 0–60 mph 4,4 с для Escalade-V. Не отдельный дорожный тест ESV. ESV от $172 300, короткая версия от $169 300. Новая версия: 38 динамиков AKG и 55″ Horizon Display. Производитель не описывает новый дисплей как OLED.
- Cadillac, спецификации: https://www.cadillac.com/suvs/escalade/specs — длиннобазная ESV, размеры и оснащение. Страница может обновляться на следующий модельный год.
- MotorTrend, GMC Yukon 2024: https://www.motortrend.com/cars/gmc/yukon/2024 — 420 hp, 6.2L V8, разгон 6,1 с в обзоре двигателя 6.2L; не отдельный подтверждённый тест Ultimate. Таблица цены Yukon Denali Ultimate 4WD: $101 245, XL $104 245. Используется короткий Yukon, не XL.
- Edmunds, Navigator L Black Label 2024: https://www.edmunds.com/lincoln/navigator/2024/st-402008812/features-specs/ — 440 hp / 3.5L Twin-Turbo V6. Сведения из поискового отрывка; полная страница не загрузилась (timeout). Проверенный инструментальный результат 5,1 с для данной комплектации не найден, поэтому основной столбец не выдаёт его за тест.
- Cadillac, цифровая брошюра 2024: https://brochures.cadillac.com/2024/escalade — прежняя система AKG на 36 динамиков. Это не оснащение нового 55″ дисплея.
- DELLA, Escalade-V 2024: https://www.dellagm.com/cadillac-escalade-v-overview.html — справочный расход 11 city / 16 highway mpg US. Это не подтверждённый показатель 2027 ESV.

Данные разных годов и баз не являются строго сопоставимым испытанием.
Оценки из задания отдельно подписаны: Yukon 5,4 с, Navigator 5,1 с, цены около $100 000 / $110 000, сценарий топлива 11/17 mpg. Они не выданы за проверенные результаты или актуальные MSRP. Все цены USD, без утверждения о составе доставки, налогов и сборов; сверяйте действующие цены у дилера.

## 3D-модель

`assets/models/escalade-esv.glb` — оригинальная процедурная дизайн-интерпретация длиннобазного SUV, созданная специально для проекта. Это не точная заводская Cadillac CAD-модель, не скан и не модель с маркетплейса. Масштаб, отделка, цвета и доступность сочетаний демонстрационные. Материал кузова `BodyPaint`, салона `Leather`, металла `Chrome`, фар `LightEmission`.

MIT, исходный генератор: `scripts/generate-model.mjs`.
В Git хранится gzip/base64-версия `escalade-esv.glb.gz.b64`; сборка восстанавливает обычный GLB.
Проверенные бесплатные карточки Sketchfab требуют авторизации для скачивания; их модели не копировались и не используются:
- https://sketchfab.com/3d-models/cadillac-escalade-esv-ead10421d63545e98eb5025e73e1364f
- https://sketchfab.com/3d-models/2021-cadillac-escalade-c15d4fa01a234535850a9086e0455455

## Звук

Оригинальный синтез Web Audio API в `js/audio.js` (MIT). Нет чужих записей, YouTube-рипов или незаявленных лицензий. Это художественный звук V8: гармоники частоты вспышек, фильтрованный шум впуска, стартовый переход и burble. Не измеренная или записанная акустическая подпись конкретного 6.2L Cadillac. Лимитер/компрессор и начальная громкость 25%. Звук запускается только после действия пользователя; выключается при уходе со вкладки.

## Фотографии

Скачаны через Wikimedia Commons API и оптимизированы в WebP (ресайз и перекодирование, без изменения содержания). Использование CC BY-SA 4.0; сохранение атрибуции и ShareAlike для производных фотографий. Эти снимки показывают обычные Escalade Sport / Premium Luxury Platinum, не V-Series ESV. Подписи сайта явно сообщают об этом.

### exterior.webp

- Автор: Damian B Oh
- Файл: https://commons.wikimedia.org/wiki/File:Cadillac_Escalade_Sport_Platinum_GMTT1XX_Black_Raven_(5).jpg
- Лицензия: CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0
- Изменения: уменьшение размера и преобразование JPEG → WebP.

### detail.webp

- Автор: Damian B Oh
- Файл: https://commons.wikimedia.org/wiki/File:Cadillac_Escalade_Premium_Luxury_Platinum_GMTT1UL_FL_Jet_Black_(10).jpg
- Лицензия: CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0
- Изменения: уменьшение размера и преобразование JPEG → WebP.

### cabin.webp

- Автор: Damian B Oh
- Файл: https://commons.wikimedia.org/wiki/File:Cadillac_Escalade_Premium_Luxury_Platinum_GMTT1UL_FL_Jet_Black_(8).jpg
- Лицензия: CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0
- Изменения: уменьшение размера и преобразование JPEG → WebP.

## Зависимости

- Three.js 0.180.0 — MIT, https://github.com/mrdoob/three.js
- GSAP 3.13.0 и ScrollTrigger — Standard License; не MIT. https://gsap.com/standard-license/ — проверяйте применимость к коммерческой перепродаже/конкурирующим инструментам.
- esbuild 0.25.10 — MIT, https://github.com/evanw/esbuild
- GitHub Actions checkout/setup-node/configure-pages/upload-pages-artifact/deploy-pages — лицензии соответствующих репозиториев actions.

Код проекта и авторская модель MIT; фотографии и зависимости сохраняют отдельные лицензии. Бандлер сохраняет license-комментарии сторонних библиотек.
