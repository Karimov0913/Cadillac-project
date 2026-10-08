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

Дополнительно загружен каталог Motor Matchup: https://www.motormatchup.com/catalog/Lincoln/Navigator-L/2024/Black-Label-4x4 — 440 hp, 3.5L V6, MSRP $113 795. Разгон 5,34 с без rollout и 5,07 с с 1ft rollout — **симуляция**, не инструментальный тест. Заголовок 5,1 с округляет второй показатель. В таблице явно подписана симуляция; оригинальные ориентиры задания показаны отдельно.

## Заводские изображения Cadillac / GM — V2

Основной экран: точное официальное изображение **Escalade-V ESV**, длинная база, из навигации Cadillac 2027:
https://www.cadillac.com/content/dam/cadillac/na/us/english/index/vehicles/2027/escalade/jelly/nav-jellies/vehicle-nav-27-escalade-esv-v-series.png

Источник кадров, цветов и салона: официальный конфигуратор Cadillac 2026:
https://www.cadillac.com/suvs/preceding-year/escalade

16 кадров внешнего вида относятся к **стандартной базе Escalade-V**, не ESV. Это фотографический turntable, не восстановленная CAD-модель и не свободное вращение по вертикали. Панорама V-Series построена из шести официальных фотографических граней салона с помощью Three.js; геометрия автомобиля из фотографий не генерируется.

Пять заводских цветов: Argent Silver Metallic, Black Raven, Vibrant White Tricoat, Radiant Red Tintcoat, Aegean Stone. Blue — созданный из красного кадра кастомный цветовой эскиз, не заводская опция. V-Series: Jet Black, Sheer Gray / Jet Black. Brandy и Renaissance Red показаны только как справочные фотографии Escalade Luxury; это не доступные здесь опции V-Series.

Детальные изображения двигателя, Brembo, дисплея, AKG и внешнего вида взяты из официальных страниц Cadillac. Полный список исходных URL: `assets/v2/sources.json` (в сборке), упакован в `asset-packs/`. WebP — оптимизированные, иногда кадрированные версии оригиналов. Демонстрируются материалы разных модельных годов.

**© Cadillac / General Motors. Эти изображения НЕ MIT, НЕ CC0 и НЕ Creative Commons.** Публичная доступность не означает свободную лицензию. Использованы в независимом демонстрационном проекте по запросу пользователя; разрешение правообладателя не получено. Для коммерческого распространения требуется отдельное урегулирование прав. Лицензия MIT распространяется только на собственный программный код.

## Реальная запись V8

- «v8 engine rev.wav», overmedium: https://freesound.org/people/overmedium/sounds/651534/
- Лицензия CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/
- Общедоступное высококачественное стереопревью: https://cdn.freesound.org/previews/651/651534_2396512-hq.mp3
- 44.1 kHz, 2 канала, ~8.57 с. Бинауральная запись реального V8. Автор не знает конкретный автомобиль: НЕ подтверждённый звук Cadillac 6.2L.

Из записи выделены холостой ход, перегазовка и сброс. Есть мягкие огибающие, лёгкая коррекция баса и компрессор; исходные стереоканалы сохранены. **Осцилляторов нет.** Начальная громкость 35%, запуск только по нажатию. При скрытии вкладки звук отключается. Кнопка «Включить V8» не выдаёт начало записи за реальное зажигание Cadillac; звук сброса не обозначен как подтверждённый заводской burble Escalade.

## Архив V1

Процедурный GLB, его генератор и старые фотографии Wikimedia сохранены в истории/исходных файлах проекта, но **не загружаются сайтом V2 и не попадают в production-сборку**. Старый синтетический звук заменён. Архивные материалы не следует считать источниками текущих визуалов.

## Лицензии архивных фотографий V1 (не используются сайтом V2)

### Wikimedia Commons

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
