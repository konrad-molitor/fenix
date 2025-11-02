<?php

namespace Database\Seeders;

use App\Enums\NotificationMode;
use App\Enums\Priority;
use App\Models\EventType;
use Illuminate\Database\Seeder;

class EventTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eventTypes = [
            // High Priority
            [
                'system_event_title' => 'Fallen tree on public road',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Fallen tree on public road',
                    'es' => 'Árbol caído en vía pública',
                    'ru' => 'Упавшее дерево на дороге',
                ],
            ],
            [
                'system_event_title' => 'Large branches at risk of falling',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Large branches at risk of falling',
                    'es' => 'Ramas grandes en riesgo de caída',
                    'ru' => 'Большие ветки, готовые упасть',
                ],
            ],
            [
                'system_event_title' => 'Broken water pipe with major leakage',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Broken water pipe with major leakage',
                    'es' => 'Tubería de agua rota con fuga importante',
                    'ru' => 'Прорыв водопровода с сильной утечкой',
                ],
            ],
            [
                'system_event_title' => 'Blocked storm drain with flooding risk',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Blocked storm drain with flooding risk',
                    'es' => 'Desagüe pluvial bloqueado con riesgo de inundación',
                    'ru' => 'Заблокированная ливневая канализация с риском затопления',
                ],
            ],
            [
                'system_event_title' => 'Deep pothole in pavement',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Deep pothole in pavement',
                    'es' => 'Bache profundo en pavimento',
                    'ru' => 'Глубокая яма на дороге',
                ],
            ],
            [
                'system_event_title' => 'Fallen or leaning utility pole',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Fallen or leaning utility pole',
                    'es' => 'Poste de servicio caído o inclinado',
                    'ru' => 'Упавший или наклонённый столб ЛЭП',
                ],
            ],
            [
                'system_event_title' => 'Broken or non-functioning traffic light',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Broken or non-functioning traffic light',
                    'es' => 'Semáforo roto o no funciona',
                    'ru' => 'Сломанный или неработающий светофор',
                ],
            ],
            [
                'system_event_title' => 'Lack of street lighting in critical areas',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Lack of street lighting in critical areas',
                    'es' => 'Falta de alumbrado público en áreas críticas',
                    'ru' => 'Отсутствие уличного освещения в критических зонах',
                ],
            ],
            [
                'system_event_title' => 'Abandoned vehicle at intersections or dangerous spots',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Abandoned vehicle at intersections or dangerous spots',
                    'es' => 'Vehículo abandonado en intersecciones o lugares peligrosos',
                    'ru' => 'Брошенное транспортное средство на перекрёстке или опасном месте',
                ],
            ],
            [
                'system_event_title' => 'Pack of aggressive stray dogs on the street',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Pack of aggressive stray dogs on the street',
                    'es' => 'Manada de perros callejeros agresivos',
                    'ru' => 'Стая агрессивных бродячих собак на улице',
                ],
            ],
            [
                'system_event_title' => 'Dead animals on public roads (sanitary risk)',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Dead animals on public roads (sanitary risk)',
                    'es' => 'Animales muertos en vías públicas (riesgo sanitario)',
                    'ru' => 'Мёртвое животное на дороге (санитарный риск)',
                ],
            ],
            [
                'system_event_title' => 'Strong bad odors (sewage overflow, garbage accumulation, industries)',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Strong bad odors (sewage overflow, garbage accumulation, industries)',
                    'es' => 'Olores fuertes desagradables (desbordamiento de aguas residuales, acumulación de basura, industrias)',
                    'ru' => 'Сильный неприятный запах (переполнение канализации, скопление мусора, промышленность)',
                ],
            ],
            [
                'system_event_title' => 'Hoarding cases (insalubrious housing with waste accumulation)',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Hoarding cases (insalubrious housing with waste accumulation)',
                    'es' => 'Casos de acaparamiento (vivienda insalubre con acumulación de residuos)',
                    'ru' => 'Случаи накопительства (антисанитарное жильё со скоплением отходов)',
                ],
            ],
            [
                'system_event_title' => 'Homeless person in critical condition (health risk)',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Homeless person in critical condition (health risk)',
                    'es' => 'Persona sin hogar en estado crítico (riesgo de salud)',
                    'ru' => 'Бездомный в критическом состоянии (риск для здоровья)',
                ],
            ],
            [
                'system_event_title' => 'Building wall or structure at risk of collapse',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Building wall or structure at risk of collapse',
                    'es' => 'Muro o estructura de edificio en riesgo de colapso',
                    'ru' => 'Стена или конструкция здания с риском обрушения',
                ],
            ],
            [
                'system_event_title' => 'Garbage burning in public space',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Garbage burning in public space',
                    'es' => 'Quema de basura en espacio público',
                    'ru' => 'Сжигание мусора в общественном месте',
                ],
            ],
            [
                'system_event_title' => 'Toxic odors or environmental contamination reports',
                'priority' => Priority::HIGH,
                'title_display_translation' => [
                    'en' => 'Toxic odors or environmental contamination reports',
                    'es' => 'Olores tóxicos o reportes de contaminación ambiental',
                    'ru' => 'Токсичные запахи или загрязнение окружающей среды',
                ],
            ],
            
            // Medium Priority
            [
                'system_event_title' => 'Overflowing garbage bin',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Overflowing garbage bin',
                    'es' => 'Contenedor de basura desbordado',
                    'ru' => 'Переполненный мусорный контейнер',
                ],
            ],
            [
                'system_event_title' => 'Broken, burned, or vandalized dumpster',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Broken, burned, or vandalized dumpster',
                    'es' => 'Contenedor roto, quemado o vandalizado',
                    'ru' => 'Сломанный, сожжённый или испорченный контейнер',
                ],
            ],
            [
                'system_event_title' => 'Garbage accumulated on sidewalks',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Garbage accumulated on sidewalks',
                    'es' => 'Basura acumulada en aceras',
                    'ru' => 'Мусор, накопившийся на тротуаре',
                ],
            ],
            [
                'system_event_title' => 'Construction debris or pruning waste in public areas',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Construction debris or pruning waste in public areas',
                    'es' => 'Escombros de construcción o residuos de poda en áreas públicas',
                    'ru' => 'Строительный мусор или отходы обрезки в общественных местах',
                ],
            ],
            [
                'system_event_title' => 'Uplifted sidewalks due to tree roots',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Uplifted sidewalks due to tree roots',
                    'es' => 'Aceras levantadas por raíces de árboles',
                    'ru' => 'Поднятый тротуар из-за корней деревьев',
                ],
            ],
            [
                'system_event_title' => 'Sick or dry tree to be removed',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Sick or dry tree to be removed',
                    'es' => 'Árbol enfermo o seco a ser removido',
                    'ru' => 'Больное или засохшее дерево требует удаления',
                ],
            ],
            [
                'system_event_title' => 'Noise disturbances (loud music, workshops, nightclubs)',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Noise disturbances (loud music, workshops, nightclubs)',
                    'es' => 'Molestias de ruido (música alta, talleres, discotecas)',
                    'ru' => 'Шумовые нарушения (громкая музыка, мастерские, ночные клубы)',
                ],
            ],
            [
                'system_event_title' => 'Unauthorized street vending',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Unauthorized street vending',
                    'es' => 'Venta ambulante no autorizada',
                    'ru' => 'Неразрешённая уличная торговля',
                ],
            ],
            [
                'system_event_title' => 'People using drugs in public',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'People using drugs in public',
                    'es' => 'Personas usando drogas en público',
                    'ru' => 'Люди употребляют наркотики на публике',
                ],
            ],
            [
                'system_event_title' => 'Stray animals at risk (not aggressive)',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Stray animals at risk (not aggressive)',
                    'es' => 'Animales callejeros en riesgo (no agresivos)',
                    'ru' => 'Бродячие животные в опасности (не агрессивные)',
                ],
            ],
            [
                'system_event_title' => 'Graffiti or vandalism on public walls',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Graffiti or vandalism on public walls',
                    'es' => 'Grafitis o vandalismo en muros públicos',
                    'ru' => 'Граффити или вандализм на общественных стенах',
                ],
            ],
            [
                'system_event_title' => 'Urban pests (rats, mosquitoes, excessive pigeons)',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Urban pests (rats, mosquitoes, excessive pigeons)',
                    'es' => 'Plagas urbanas (ratas, mosquitos, palomas excesivas)',
                    'ru' => 'Городские вредители (крысы, комары, избыток голубей)',
                ],
            ],
            [
                'system_event_title' => 'Abandoned unsafe house/building',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Abandoned unsafe house/building',
                    'es' => 'Casa/edificio abandonado inseguro',
                    'ru' => 'Заброшенное небезопасное здание/дом',
                ],
            ],
            [
                'system_event_title' => 'Persistent odors in dumpsters or storm drains',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Persistent odors in dumpsters or storm drains',
                    'es' => 'Olores persistentes en contenedores o desagües pluviales',
                    'ru' => 'Устойчивые запахи у контейнеров или ливневых стоков',
                ],
            ],
            [
                'system_event_title' => 'Broken playground equipment in parks',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Broken playground equipment in parks',
                    'es' => 'Equipamiento de parque infantil roto',
                    'ru' => 'Сломанное оборудование детской площадки',
                ],
            ],
            [
                'system_event_title' => 'Damaged benches or streetlights in public spaces',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Damaged benches or streetlights in public spaces',
                    'es' => 'Bancos o farolas dañadas en espacios públicos',
                    'ru' => 'Повреждённые скамейки или уличные фонари',
                ],
            ],
            [
                'system_event_title' => 'Vandalized bus shelter',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Vandalized bus shelter',
                    'es' => 'Parada de autobús vandalizada',
                    'ru' => 'Испорченная остановка общественного транспорта',
                ],
            ],
            [
                'system_event_title' => 'Poor maintenance of parks and sports fields',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Poor maintenance of parks and sports fields',
                    'es' => 'Mal mantenimiento de parques y campos deportivos',
                    'ru' => 'Плохое обслуживание парков и спортивных площадок',
                ],
            ],
            [
                'system_event_title' => 'Minor odor complaints (garbage, shops, etc.)',
                'priority' => Priority::MEDIUM,
                'title_display_translation' => [
                    'en' => 'Minor odor complaints (garbage, shops, etc.)',
                    'es' => 'Quejas de olor menor (basura, tiendas, etc.)',
                    'ru' => 'Незначительные жалобы на запахи (мусор, магазины и т.д.)',
                ],
            ],
            
            // Low Priority
            [
                'system_event_title' => 'Faded pedestrian crossings',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Faded pedestrian crossings',
                    'es' => 'Pasos de peatones desgastados',
                    'ru' => 'Выцветшие пешеходные переходы',
                ],
            ],
            [
                'system_event_title' => 'Damaged or illegible traffic signs',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Damaged or illegible traffic signs',
                    'es' => 'Señales de tráfico dañadas o ilegibles',
                    'ru' => 'Повреждённые или нечитаемые дорожные знаки',
                ],
            ],
            [
                'system_event_title' => 'Bus stop without clear signage',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Bus stop without clear signage',
                    'es' => 'Parada de autobús sin señalización clara',
                    'ru' => 'Остановка без чёткой указательной таблички',
                ],
            ],
            [
                'system_event_title' => 'Poorly parked bicycles or scooters',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Poorly parked bicycles or scooters',
                    'es' => 'Bicicletas o scooters mal estacionados',
                    'ru' => 'Неправильно припаркованные велосипеды или самокаты',
                ],
            ],
            [
                'system_event_title' => 'Blocked accessibility ramps',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Blocked accessibility ramps',
                    'es' => 'Rampas de accesibilidad bloqueadas',
                    'ru' => 'Заблокированные пандусы',
                ],
            ],
            [
                'system_event_title' => 'Unauthorized public space occupation without risk',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Unauthorized public space occupation without risk',
                    'es' => 'Ocupación no autorizada del espacio público sin riesgo',
                    'ru' => 'Неразрешённое занятие общественного места без опасности',
                ],
            ],
            [
                'system_event_title' => 'Poor maintenance of community or neighborhood centers',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Poor maintenance of community or neighborhood centers',
                    'es' => 'Mal mantenimiento de centros comunitarios o vecinales',
                    'ru' => 'Плохое обслуживание общественных или районных центров',
                ],
            ],
            [
                'system_event_title' => 'Illegal tree cutting (administrative report)',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Illegal tree cutting (administrative report)',
                    'es' => 'Tala ilegal de árboles (informe administrativo)',
                    'ru' => 'Незаконная вырубка дерева (административный отчёт)',
                ],
            ],
            [
                'system_event_title' => 'Excessive taxis/cars parked in unauthorized zones',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Excessive taxis/cars parked in unauthorized zones',
                    'es' => 'Exceso de taxis/coches estacionados en zonas no autorizadas',
                    'ru' => 'Избыток такси/машин, припаркованных в неразрешённых зонах',
                ],
            ],
            [
                'system_event_title' => 'Vandalized public sports field (without structural risk)',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Vandalized public sports field (without structural risk)',
                    'es' => 'Campo deportivo público vandalizado (sin riesgo estructural)',
                    'ru' => 'Испорченная спортивная площадка (без структурного риска)',
                ],
            ],
            [
                'system_event_title' => 'Damaged sports equipment',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Damaged sports equipment',
                    'es' => 'Equipamiento deportivo dañado',
                    'ru' => 'Повреждённое спортивное оборудование',
                ],
            ],
            [
                'system_event_title' => 'Flickering or insufficient public lighting',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Flickering or insufficient public lighting',
                    'es' => 'Alumbrado público parpadeante o insuficiente',
                    'ru' => 'Мерцающее или недостаточное освещение',
                ],
            ],
            [
                'system_event_title' => 'Vehicles parked on sidewalks (minor report)',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Vehicles parked on sidewalks (minor report)',
                    'es' => 'Vehículos estacionados en aceras (reporte menor)',
                    'ru' => 'Транспорт, припаркованный на тротуарах (незначительный отчёт)',
                ],
            ],
            [
                'system_event_title' => 'Unauthorized graffiti (non-severe vandalism, aesthetic issue)',
                'priority' => Priority::LOW,
                'title_display_translation' => [
                    'en' => 'Unauthorized graffiti (non-severe vandalism, aesthetic issue)',
                    'es' => 'Grafitis no autorizados (vandalismo leve, problema estético)',
                    'ru' => 'Неразрешённое граффити (несерьёзный вандализм, эстетическая проблема)',
                ],
            ],
        ];

        foreach ($eventTypes as $eventType) {
            EventType::create([
                'system_event_title' => $eventType['system_event_title'],
                'priority' => $eventType['priority'],
                'title_display_translation' => $eventType['title_display_translation'],
                'notify_to' => null,
                'notification_mode' => NotificationMode::NONE,
                'moderated_by' => null,
            ]);
        }
    }
}
