// Данные отделены от интерфейса. Оценки из ТЗ не выдаём за тесты.
export const paints=[
 {id:'silver',name:'Argent Silver',finish:'METALLIC',hex:'#9aa4ac'},
 {id:'black',name:'Black Raven',finish:'SOLID',hex:'#12151b'},
 {id:'white',name:'Crystal White',finish:'TRICOAT STUDY',hex:'#e7e7e1'},
 {id:'red',name:'Radiant Red',finish:'TINTCOAT STUDY',hex:'#6d1226'},
 {id:'blue',name:'Midnight Blue',finish:'CUSTOM STUDY',hex:'#153052'},
 {id:'gray',name:'Galactic Gray',finish:'METALLIC STUDY',hex:'#454953'}
];
export const interiors=[
 {id:'black',name:'Jet Black',hex:'#252323'},
 {id:'beige',name:'Linen',hex:'#baaa8a'},
 {id:'brown',name:'Cognac',hex:'#79513b'},
 {id:'red',name:'Bordeaux',hex:'#671e2c'}
];
export const comparison=[
 {label:'Мощность',values:['682 hp','420 hp','440 hp'],em:true},
 {label:'Двигатель',values:['6.2L Supercharged V8','6.2L V8','3.5L Twin-Turbo V6']},
 {label:'0–60 mph · данные источников',values:['4.4 с¹','6.1 с²','Не подтверждено³'],em:true},
 {label:'Цена / ориентир USD',values:['От $172,300¹','$101,245²','≈ $110,000⁴']},
 {label:'0–60 mph · ориентиры задания⁴',values:['4.4 с','5.4 с','5.1 с']}
];
export const sources=[
 {label:'Cadillac · Escalade-V (2027)',url:'https://www.cadillac.com/suv/escalade/v-series',note:'¹ 682 hp, 6.2L Supercharged V8, 653 lb-ft, 4,4 с — оценка Cadillac для Escalade-V, не отдельный тест ESV. Цена ESV $172 300; короткая версия $169 300. Налоги, доставка, опции и сборы не включены. Новая версия: 55″ Horizon Display, 38 динамиков AKG. Производитель не называет новый 55″ дисплей OLED.'},
 {label:'MotorTrend · GMC Yukon 2024',url:'https://www.motortrend.com/cars/gmc/yukon/2024',note:'² Цена Yukon Denali Ultimate 4WD (2024) $101 245 по таблице MotorTrend. 420 hp, 6.2L V8, 6,1 с — обзор конфигурации с 6.2L V8, не отдельный подтверждённый тест Denali Ultimate. Годы и методики измерений различаются.'},
 {label:'Edmunds · Navigator L Black Label 2024',url:'https://www.edmunds.com/lincoln/navigator/2024/st-402008812/features-specs/',note:'³ Подтверждает 440 hp и двигатель 3.5L V6 Twin-Turbo. Подтверждённый инструментальный тест 5,1 с именно этой версии не найден; в основной строке не подменён тестом другой комплектации.'},
 {label:'Cadillac · Digital Brochure 2024',url:'https://brochures.cadillac.com/2024/escalade',note:'36 динамиков AKG относятся к модели 2024. Не объединяем эту спецификацию с 55″ дисплеем новой версии.'},
 {label:'DELLA · Escalade-V 2024 fuel economy',url:'https://www.dellagm.com/cadillac-escalade-v-overview.html',note:'Справочный расход 2024: 11 city / 16 highway mpg (US). 11 / 17 mpg доступен как отдельный сценарий из задания, а не сертифицированный показатель новой ESV.'}
];
export const dataDisclaimer='⁴ Цены конкурентов около $100 000 / $110 000 и разгон 5,4 / 5,1 с — исходные ориентиры задания, не проверенные MSRP или результаты тестов. Сравнение информационное: разные годы, базы и комплектации; не строго сопоставимый дорожный тест. Оттенки конфигуратора демонстрационные и не являются гарантией доступности заводских комбинаций.';
export const gallery=[
 {file:'exterior.webp',title:'Commanding presence.',alt:'Cadillac Escalade Sport Platinum, вид спереди',description:'Escalade Sport Platinum · справочное фото, не V-Series ESV'},
 {file:'detail.webp',title:'Room for the extraordinary.',alt:'Кожаные капитанские кресла Cadillac Escalade Premium Luxury Platinum',description:'Escalade Premium Luxury Platinum · справочное фото салона'},
 {file:'cabin.webp',title:'Every detail. Considered.',alt:'Руль и отделка водительского места Cadillac Escalade',description:'Escalade Premium Luxury Platinum · справочное фото салона'}
];
// Корректное смешение расхода на расстояние, а не среднего mpg.
export function calculateFuel(km,price,cityShare,highwayMpg=16){
 const l100=(cityShare/100)*(235.214583/11)+(1-cityShare/100)*(235.214583/highwayMpg);
 const litres=km*l100/100;return{l100,litres,cost:litres*price};
}
