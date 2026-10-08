// Данные отделены от интерфейса. Оценки из ТЗ не выдаём за тесты.
export const paints = [
  {
    id: "silver",
    name: "Argent Silver",
    finish: "ЗАВОДСКОЙ ОТТЕНОК",
    hex: "#9da5ad",
    image: "paint-silver.webp",
  },
  {
    id: "black",
    name: "Black Raven",
    finish: "ЗАВОДСКОЙ ОТТЕНОК",
    hex: "#15181d",
    image: "paint-black.webp",
  },
  {
    id: "white",
    name: "Vibrant White",
    finish: "TRICOAT",
    hex: "#e5e4df",
    image: "paint-white.webp",
  },
  {
    id: "red",
    name: "Radiant Red",
    finish: "TINTCOAT",
    hex: "#801a2c",
    image: "paint-red.webp",
  },
  {
    id: "blue",
    name: "Midnight Blue",
    finish: "КАСТОМНЫЙ ЭСКИЗ",
    hex: "#17365b",
    image: "paint-blue-custom.webp",
  },
  {
    id: "gray",
    name: "Aegean Stone",
    finish: "ЗАВОДСКОЙ ОТТЕНОК",
    hex: "#6f7974",
    image: "paint-gray.webp",
  },
];
export const interiors = [
  {
    id: "black",
    name: "Jet Black",
    hex: "#252323",
    image: "pano-black-b.webp",
    note: "V-Series · заводской интерьер",
  },
  {
    id: "gray",
    name: "Sheer Gray",
    hex: "#c7c5be",
    image: "pano-gray-b.webp",
    note: "V-Series · заводской интерьер",
  },
  {
    id: "brown",
    name: "Brandy",
    hex: "#875638",
    image: "interior-brown-seats.webp",
    note: "Референс Escalade Luxury, не вариант V-Series",
  },
  {
    id: "red",
    name: "Renaissance Red",
    hex: "#7a2531",
    image: "interior-red-seats.webp",
    note: "Референс Escalade Luxury, не вариант V-Series",
  },
];
export const scenes = [
  {
    id: "power",
    label: "01 / HAND-BUILT POWER",
    value: "682",
    unit: "hp",
    title: "Компрессорная сила.",
    text: "6.2L Supercharged V8. Собран вручную — и подписан мастером.",
    image: "engine.webp",
    alt: "Реальный 6.2L Supercharged V8 под капотом Escalade-V",
    note: "682 hp · 653 lb-ft — Cadillac Escalade-V.",
  },
  {
    id: "launch",
    label: "02 / PRESENCE IN MOTION",
    value: "4.4",
    unit: "s",
    title: "Большой. Не медленный.",
    text: "0–60 mph. Характер V-Series чувствуется не только на старте.",
    image: "drive.webp",
    alt: "Официальная фотография красного Cadillac Escalade-V, вид сбоку",
    note: "Оценка Cadillac для Escalade-V, не отдельный тест ESV.",
  },
  {
    id: "brakes",
    label: "03 / PRECISION UNDER PRESSURE",
    value: "Brembo",
    unit: "",
    title: "Мощь под контролем.",
    text: "Высокопроизводительные передние тормоза. Точность — до последнего метра.",
    image: "brakes.webp",
    alt: "Реальное колесо Escalade-V и красный суппорт Brembo",
    note: "Официальное изображение Cadillac. Комплектация зависит от года.",
  },
  {
    id: "display",
    label: "04 / A NEW PERSPECTIVE",
    value: "55″",
    unit: "",
    title: "Весь горизонт — ваш.",
    text: "Панорамный Horizon Display. Пространство, в котором всё на своём месте.",
    image: "display.webp",
    alt: "Реальный салон Escalade-V с панорамным 55-дюймовым дисплеем",
    note: "Общая диагональ. Не заявляется как 55-дюймовый OLED.",
  },
  {
    id: "sound",
    label: "05 / SOUND WITHOUT BOUNDARIES",
    value: "38",
    unit: "speakers",
    title: "Роскошь звучит иначе.",
    text: "AKG Studio Reference. Внимание к деталям, которое можно услышать.",
    image: "speaker.webp",
    alt: "Реальный динамик AKG в интерьере Escalade-V",
    note: "Новая версия. У модели 2024 — 36 динамиков.",
  },
];
export const comparison = [
  { label: "Мощность", values: ["682 hp", "420 hp", "440 hp"], em: true },
  {
    label: "Двигатель",
    values: ["6.2L Supercharged V8", "6.2L V8", "3.5L Twin-Turbo V6"],
  },
  {
    label: "0–60 mph · данные источников",
    values: ["4.4 с¹", "6.1 с²", "5.34 с³"],
    notes: ["Оценка Cadillac", "Обзор 6.2L V8", "Симуляция · без rollout"],
    em: true,
  },
  {
    label: "Цена в источниках / USD",
    values: ["От $172,300¹", "$101,245²", "$113,795³"],
  },
  {
    label: "0–60 mph · ориентиры задания⁴",
    values: ["4.4 с", "5.4 с", "5.1 с"],
  },
  {
    label: "Цены из задания / USD⁴",
    values: ["$172,300", "$100,000", "$110,000"],
  },
];
export const sources = [
  {
    label: "Cadillac · Escalade-V (2027)",
    url: "https://www.cadillac.com/suv/escalade/v-series",
    note: "¹ 682 hp, 6.2L Supercharged V8, 653 lb-ft, 4,4 с — оценка Cadillac для Escalade-V, не отдельный тест ESV. Цена ESV $172 300; короткая версия $169 300. Налоги, доставка, опции и сборы не включены. Новая версия: 55″ Horizon Display, 38 динамиков AKG. Производитель не называет новый 55″ дисплей OLED.",
  },
  {
    label: "MotorTrend · GMC Yukon 2024",
    url: "https://www.motortrend.com/cars/gmc/yukon/2024",
    note: "² Цена Yukon Denali Ultimate 4WD (2024) $101 245 по таблице MotorTrend. 420 hp, 6.2L V8, 6,1 с — обзор конфигурации с 6.2L V8, не отдельный подтверждённый тест Denali Ultimate. Годы и методики измерений различаются.",
  },
  {
    label: "Motor Matchup · Navigator L Black Label 2024",
    url: "https://www.motormatchup.com/catalog/Lincoln/Navigator-L/2024/Black-Label-4x4",
    note: "³ Каталог: 440 hp, 3.5L Twin-Turbo V6, MSRP $113 795. Разгон 5,34 с без rollout — расчётная симуляция Motor Matchup, не дорожный тест. В заголовке сайта 5,1 с — округлённая симуляция с 1ft rollout (5,07 с). Методы Cadillac, MotorTrend и симуляции не сопоставимы напрямую.",
  },
  {
    label: "Edmunds · Navigator L Black Label 2024",
    url: "https://www.edmunds.com/lincoln/navigator/2024/st-402008812/features-specs/",
    note: "Подтверждает 440 hp и двигатель 3.5L V6 Twin-Turbo. Подтверждённый инструментальный тест 5,1 с именно этой версии не найден; в основной строке не подменён тестом другой комплектации.",
  },
  {
    label: "Cadillac · Digital Brochure 2024",
    url: "https://brochures.cadillac.com/2024/escalade",
    note: "36 динамиков AKG относятся к модели 2024. Не объединяем эту спецификацию с 55″ дисплеем новой версии.",
  },
  {
    label: "DELLA · Escalade-V 2024 fuel economy",
    url: "https://www.dellagm.com/cadillac-escalade-v-overview.html",
    note: "Справочный расход 2024: 11 city / 16 highway mpg (US). 11 / 17 mpg доступен как отдельный сценарий из задания, а не сертифицированный показатель новой ESV.",
  },
];
export const dataDisclaimer =
  "⁴ Цены конкурентов около $100 000 / $110 000 и разгон 5,4 / 5,1 с — исходные ориентиры задания, не проверенные MSRP или результаты тестов. Сравнение информационное: разные годы, базы и комплектации; не строго сопоставимый дорожный тест. Оттенки конфигуратора демонстрационные и не являются гарантией доступности заводских комбинаций.";
export const gallery = [
  {
    file: "drive.webp",
    title: "Presence in every line.",
    alt: "Красный Escalade-V, официальное фото сбоку",
    description: "Cadillac / GM · официальное изображение V-Series",
  },
  {
    file: "rear.webp",
    title: "Leave a lasting impression.",
    alt: "Красный Escalade-V, официальный вид сзади",
    description: "Cadillac / GM · официальное изображение V-Series",
  },
  {
    file: "display.webp",
    title: "A different point of view.",
    alt: "Настоящий интерьер Escalade-V с Horizon Display",
    description: "Cadillac / GM · официальный интерьер V-Series",
  },
];
// Корректное смешение расхода на расстояние, а не среднего mpg.
export function calculateFuel(km, price, cityShare, highwayMpg = 16) {
  const l100 =
    (cityShare / 100) * (235.214583 / 11) +
    (1 - cityShare / 100) * (235.214583 / highwayMpg);
  const litres = (km * l100) / 100;
  return { l100, litres, cost: litres * price };
}
