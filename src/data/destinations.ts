import type { Destination } from '../types';
import { DESTINATION_IMAGES } from './destinationImages';

/**
 * Destination content. To add a place, append an entry here and (optionally)
 * add photo URLs under the same slug in `destinationImages.ts`. The map
 * marker, cards, search and detail view all pick it up automatically.
 */
type DestinationContent = Omit<Destination, 'id' | 'images'>;

const CONTENT: DestinationContent[] = [
  {
    slug: 'hanoi',
    name: 'Hanoi',
    localName: 'Hà Nội',
    region: 'north',
    province: 'Hanoi Capital',
    coordinates: [105.85, 21.03],
    categories: ['city', 'culture', 'history', 'food'],
    description: 'A thousand-year-old capital of lakes, temples and street kitchens.',
    longDescription:
      'Hanoi moves at two speeds. Motorbikes pour through the 36 streets of the Old Quarter, each once given to a single trade, while a few steps away people do tai chi beside Hoàn Kiếm Lake at dawn. Tree-lined boulevards from the French period, Confucian courtyards and tiny plastic stools on the pavement all share the same few square kilometres.',
    history:
      'Emperor Lý Thái Tổ moved his court here in 1010 and named the city Thăng Long, “rising dragon”. It has been the political centre of Vietnam for most of the thousand years since, through the Lý, Trần and Lê dynasties, French rule and reunification in 1975.',
    culture:
      'Hanoi is the home of water puppetry, ca trù chamber singing and a café culture built around egg coffee. Tết, the lunar new year, fills the streets with peach blossom and kumquat trees.',
    attractions: [
      'Hoàn Kiếm Lake and Ngọc Sơn Temple',
      'Temple of Literature, Vietnam’s first university (1076)',
      'The Old Quarter’s 36 guild streets',
      'Imperial Citadel of Thăng Long',
      'One Pillar Pagoda',
    ],
    activities: [
      'Eat your way down a street-food lane after dark',
      'Watch a water puppet show by the lake',
      'Walk the Old Quarter at sunrise before the traffic starts',
      'Drink egg coffee in a hidden upstairs café',
    ],
    foods: [
      { name: 'Phở bò', description: 'Beef noodle soup with a clear, long-simmered broth.' },
      { name: 'Bún chả', description: 'Charcoal-grilled pork with rice noodles and herbs.' },
      { name: 'Chả cá Lã Vọng', description: 'Turmeric fish fried at the table with dill.' },
      { name: 'Cà phê trứng', description: 'Strong coffee under a whipped egg-yolk cream.' },
    ],
    bestTime: 'October to December, and March to April',
    travelTips: [
      'Cross the road at a slow, steady pace. Riders steer around you.',
      'The Old Quarter is closed to traffic on weekend evenings.',
      'Winters can drop to 10°C, so bring a layer from December to February.',
    ],
  },
  {
    slug: 'ha-long-bay',
    name: 'Ha Long Bay',
    localName: 'Vịnh Hạ Long',
    region: 'north',
    province: 'Quảng Ninh Province',
    coordinates: [107.1, 20.9],
    categories: ['nature', 'adventure'],
    description: 'An extraordinary landscape of limestone islands rising from emerald waters.',
    longDescription:
      'Around 1,600 limestone islands and islets stand in the Gulf of Tonkin, most of them uninhabited and covered in jungle. Boats thread between the towers past floating fishing villages, hidden lagoons and caves hung with stalactites. Quieter Lan Hạ and Bái Tử Long bays share the same scenery with fewer boats.',
    history:
      'The name means “descending dragon”. Legend says dragons sent by the gods spat out jewels that became the islands and blocked invaders from the sea. UNESCO listed the bay in 1994 and extended the site to include the Cát Bà Archipelago in 2023.',
    culture:
      'Fishing families have lived on the water here for generations, in floating villages such as Cửa Vạn and Vung Viêng.',
    attractions: [
      'Sửng Sốt (Surprise) Cave',
      'Ti Tốp Island viewpoint',
      'Lan Hạ Bay and Cát Bà Island',
      'Bái Tử Long Bay',
      'Vung Viêng floating village',
    ],
    activities: [
      'Sleep on the water on an overnight cruise',
      'Kayak through sea arches into hidden lagoons',
      'Climb to the Ti Tốp lookout for the full panorama',
      'Cycle and hike in Cát Bà National Park',
    ],
    foods: [
      { name: 'Chả mực', description: 'Hand-pounded squid cakes, fried until golden.' },
      { name: 'Sá sùng', description: 'Dried sea worm, used to sweeten broths.' },
      { name: 'Grilled oysters', description: 'Served with spring onion oil and peanuts.' },
    ],
    bestTime: 'March to May, and September to November',
    travelTips: [
      'Two days and one night is the minimum to get beyond the busy inner bay.',
      'Cruises can be cancelled in storm season, June to August. Keep plans flexible.',
      'Lan Hạ Bay routes leaving from Cát Bà are noticeably quieter.',
    ],
  },
  {
    slug: 'sapa',
    name: 'Sapa',
    localName: 'Sa Pa',
    region: 'north',
    province: 'Lào Cai Province',
    coordinates: [103.84, 22.34],
    categories: ['nature', 'adventure', 'culture'],
    description: 'Rice terraces stepped down the slopes of Vietnam’s highest mountains.',
    longDescription:
      'Sapa sits at 1,500 metres in the Hoàng Liên Sơn range, facing Fansipan, the highest peak in Indochina at 3,147 metres. Below the town, the Mường Hoa Valley is carved into terraces that turn from mirror-bright water in spring to green in summer and gold at harvest.',
    history:
      'The French built a hill station here in the early 1900s to escape the lowland heat. The terraces are much older, cut by hand over centuries by the Hmông, Dao and Giáy people.',
    culture:
      'Five main ethnic groups live around Sapa, each with its own language and dress. Hmông indigo dyeing and Red Dao herbal baths are still part of daily life.',
    attractions: [
      'Fansipan summit',
      'Mường Hoa Valley terraces',
      'Cát Cát and Tả Van villages',
      'Ô Quy Hồ Pass',
      'Bắc Hà Sunday market',
    ],
    activities: [
      'Trek between villages with a local Hmông guide',
      'Stay in a family homestay in Tả Van',
      'Ride the cable car or hike two days to Fansipan',
      'Soak in a Red Dao herbal bath after walking',
    ],
    foods: [
      { name: 'Thắng cố', description: 'A hearty highland stew, traditionally of horse meat.' },
      { name: 'Cơm lam', description: 'Sticky rice roasted inside bamboo.' },
      { name: 'Grilled stream fish', description: 'Salmon and sturgeon are farmed in the cold water here.' },
    ],
    bestTime: 'September to October for golden terraces, March to May for clear skies',
    travelTips: [
      'Harvest is in late September. Come a week or two earlier for the best colour.',
      'Trails are steep and muddy after rain. Wear proper shoes.',
      'Book treks through village cooperatives so the money stays local.',
    ],
  },
  {
    slug: 'ha-giang',
    name: 'Ha Giang',
    localName: 'Hà Giang',
    region: 'north',
    province: 'Tuyên Quang Province',
    coordinates: [105.2, 22.95],
    categories: ['adventure', 'nature', 'culture'],
    description: 'The far north, where roads cling to grey karst above deep river gorges.',
    longDescription:
      'Vietnam’s northernmost frontier is a plateau of bare limestone peaks, cornfields planted between rocks and villages reached by switchback roads. The Hà Giang Loop, a three to four day circuit, crosses the Mã Pí Lèng Pass high above the jade-green Nho Quế River.',
    history:
      'The Đồng Văn Karst Plateau holds fossils up to 500 million years old and became Vietnam’s first UNESCO Global Geopark in 2010. The Hmông Vương family ruled the area from a fortified palace built in the 1920s.',
    culture:
      'Hmông, Tày, Dao and Lô Lô communities meet at weekly markets in Đồng Văn and Mèo Vạc. Buckwheat flowers colour the hills pink each autumn.',
    attractions: [
      'Mã Pí Lèng Pass',
      'Nho Quế River and Tu Sản Canyon',
      'Đồng Văn Karst Plateau Geopark',
      'Lũng Cú flag tower',
      'Vương family palace',
    ],
    activities: [
      'Ride the Loop by motorbike, or as a passenger with an easy rider',
      'Take a boat through Tu Sản Canyon',
      'Visit the Sunday market in Đồng Văn',
      'See the terraces of Hoàng Su Phì',
    ],
    foods: [
      { name: 'Thắng dền', description: 'Warm rice dumplings in ginger syrup.' },
      { name: 'Mèn mén', description: 'Steamed ground corn, the staple of the plateau.' },
      { name: 'Bánh tam giác mạch', description: 'Soft cakes made from buckwheat flour.' },
    ],
    bestTime: 'September to November, and March to May',
    travelTips: [
      'A motorbike licence valid in Vietnam is required to ride yourself.',
      'Hiring a local driver is the safer option on these roads.',
      'Nights are cold from November to February. Pack warm layers.',
    ],
  },
  {
    slug: 'ninh-binh',
    name: 'Ninh Binh',
    localName: 'Ninh Bình',
    region: 'north',
    province: 'Ninh Bình Province',
    coordinates: [105.94, 20.25],
    categories: ['nature', 'history', 'culture'],
    description: 'Limestone towers over rice fields, explored by rowing boat.',
    longDescription:
      'Often described as Ha Long Bay on land. Rivers wind between sheer karst walls and pass straight through low caves, with rice growing right to the water’s edge. Local rowers steer the sampans, often using their feet.',
    history:
      'Hoa Lư was the capital of the first independent Vietnamese state in the 10th century, under the Đinh and early Lê dynasties, before the court moved to what is now Hanoi. The Tràng An landscape was listed by UNESCO in 2014.',
    culture:
      'Temples and pagodas are built into the cliffs themselves. Bái Đính is one of the largest Buddhist complexes in Southeast Asia.',
    attractions: [
      'Tràng An boat routes',
      'Tam Cốc and Bích Động pagoda',
      'Hang Múa viewpoint',
      'Hoa Lư ancient capital',
      'Bái Đính Pagoda',
      'Cúc Phương National Park',
    ],
    activities: [
      'Take a sampan through the caves of Tràng An',
      'Climb the 500 steps of Hang Múa for sunset',
      'Cycle the lanes between rice paddies',
      'Look for langurs in Vân Long reserve',
    ],
    foods: [
      { name: 'Dê núi', description: 'Mountain goat, grilled or served rare with lime.' },
      { name: 'Cơm cháy', description: 'Crisp scorched rice with a savoury sauce.' },
      { name: 'Miến lươn', description: 'Glass noodles with fried eel.' },
    ],
    bestTime: 'Late May to early June for golden rice, or January to March',
    travelTips: [
      'Tràng An is larger and better organised than Tam Cốc. Go early to avoid queues.',
      'Two hours from Hanoi by road or train, so it works as an overnight trip.',
      'Rowers work hard. A small tip is appreciated.',
    ],
  },
  {
    slug: 'hue',
    name: 'Hue',
    localName: 'Huế',
    region: 'central',
    province: 'Huế City',
    coordinates: [107.58, 16.46],
    categories: ['history', 'culture', 'architecture', 'food'],
    description: 'The last imperial capital, set along the Perfume River.',
    longDescription:
      'Huế is a quiet, green city of moats, gates and gardens. Behind the walls of the citadel lies the Imperial City of the Nguyễn emperors, and along the river to the south stand their tombs, each designed as a private landscape.',
    history:
      'Huế was the capital of the Nguyễn dynasty from 1802 to 1945. Much of the citadel was damaged in 1968 and has been under careful restoration since UNESCO listed the monuments in 1993.',
    culture:
      'Court music, nhã nhạc, is recognised by UNESCO, and the city is known for its conical poem hats and its refined royal cooking.',
    attractions: [
      'Imperial City and Ngọ Môn Gate',
      'Thiên Mụ Pagoda',
      'Tomb of Khải Định',
      'Tomb of Minh Mạng',
      'Đông Ba Market',
    ],
    activities: [
      'Take a dragon boat along the Perfume River',
      'Cycle out to the royal tombs',
      'Try a spread of small royal-style dishes',
      'Ride the Hải Vân Pass to Da Nang',
    ],
    foods: [
      { name: 'Bún bò Huế', description: 'Spicy beef noodle soup scented with lemongrass.' },
      { name: 'Bánh khoái', description: 'A crisp rice pancake with pork and prawn.' },
      { name: 'Cơm hến', description: 'Rice with tiny river clams, herbs and peanuts.' },
      { name: 'Chè Huế', description: 'Dozens of sweet soups sold by the glass.' },
    ],
    bestTime: 'February to April',
    travelTips: [
      'Heavy rain falls from October to December.',
      'Dress modestly at pagodas and tombs.',
      'Give the citadel at least half a day.',
    ],
  },
  {
    slug: 'da-nang',
    name: 'Da Nang',
    localName: 'Đà Nẵng',
    region: 'central',
    province: 'Da Nang City',
    coordinates: [108.21, 16.06],
    categories: ['city', 'beach', 'architecture'],
    description: 'A modern coastal city with long beaches and mountains at both ends.',
    longDescription:
      'Da Nang is the easy-going hub of the central coast. Mỹ Khê beach runs for kilometres along the eastern edge of the city, the forested Sơn Trà peninsula rises to the north, and the Marble Mountains stand over the road south to Hội An.',
    history:
      'The port was known to the French as Tourane and was one of the first places they landed in 1858. Far earlier it lay within the Champa kingdom, whose sculpture fills the city’s Cham museum.',
    culture:
      'The city puts on a show each weekend, when the Dragon Bridge breathes fire and water, and hosts an international fireworks festival in summer.',
    attractions: [
      'Dragon Bridge',
      'Golden Bridge at Bà Nà Hills',
      'Marble Mountains',
      'Mỹ Khê Beach',
      'Sơn Trà Peninsula and Linh Ứng Pagoda',
      'Museum of Cham Sculpture',
    ],
    activities: [
      'Swim or surf at Mỹ Khê',
      'Watch the Dragon Bridge at 9pm on weekends',
      'Explore the cave temples of the Marble Mountains',
      'Drive the Hải Vân Pass',
    ],
    foods: [
      { name: 'Mì Quảng', description: 'Turmeric noodles with a small amount of rich broth.' },
      { name: 'Bánh tráng cuốn thịt heo', description: 'Rice paper rolls of sliced pork and herbs.' },
      { name: 'Bún chả cá', description: 'Noodle soup with fish cake.' },
    ],
    bestTime: 'February to August',
    travelTips: [
      'Hội An is 45 minutes south, so the two combine well.',
      'Typhoon season runs from September to November.',
      'Sunrise on the beach is a local ritual worth joining.',
    ],
  },
  {
    slug: 'hoi-an',
    name: 'Hoi An',
    localName: 'Hội An',
    region: 'central',
    province: 'Da Nang City',
    coordinates: [108.33, 15.88],
    categories: ['culture', 'architecture', 'food', 'history'],
    description: 'A lantern-lit trading port preserved almost exactly as it was.',
    longDescription:
      'The old town of Hội An is a grid of ochre-walled merchant houses, assembly halls and family chapels along the Thu Bồn River. At night, silk lanterns light the streets and small boats carry candles on the water.',
    history:
      'From the 15th to the 19th century Hội An was one of Southeast Asia’s busiest ports, with Japanese, Chinese and European merchants living side by side. When the river silted up, trade moved to Da Nang and the town was left untouched. UNESCO listed it in 1999.',
    culture:
      'On the 14th day of each lunar month, the old town switches off its electric lights for the lantern festival. Tailoring is the town’s living craft.',
    attractions: [
      'Japanese Covered Bridge',
      'Tấn Ký Old House',
      'Fujian Assembly Hall',
      'An Bàng Beach',
      'Trà Quế vegetable village',
      'Mỹ Sơn Cham sanctuary',
    ],
    activities: [
      'Walk the old town after dark',
      'Have clothes made by a tailor',
      'Join a cooking class at Trà Quế',
      'Paddle a basket boat through the coconut palms',
    ],
    foods: [
      { name: 'Cao lầu', description: 'Thick noodles, pork and greens, made only in Hội An.' },
      { name: 'Bánh mì', description: 'The town is famous for its loaded baguettes.' },
      { name: 'White rose dumplings', description: 'Steamed prawn dumplings shaped like flowers.' },
      { name: 'Cơm gà', description: 'Turmeric rice with shredded chicken and herbs.' },
    ],
    bestTime: 'February to April',
    travelTips: [
      'The old town is closed to motor traffic for most of the day.',
      'The streets can flood in October and November.',
      'An entry ticket covers a choice of the heritage houses.',
    ],
  },
  {
    slug: 'phong-nha',
    name: 'Phong Nha',
    localName: 'Phong Nha – Kẻ Bàng',
    region: 'central',
    province: 'Quảng Trị Province',
    coordinates: [106.28, 17.59],
    categories: ['adventure', 'nature'],
    description: 'Jungle-covered karst hiding the largest caves on Earth.',
    longDescription:
      'Phong Nha – Kẻ Bàng National Park protects one of the oldest karst landscapes in Asia. Beneath the forest run hundreds of caves and underground rivers, including Sơn Đoòng, whose main passage is large enough to hold a city block and its own patch of jungle.',
    history:
      'The limestone here is around 400 million years old. Sơn Đoòng was found by a local man, Hồ Khanh, in 1990 and surveyed in 2009. The park was listed by UNESCO in 2003.',
    culture:
      'The caves sheltered people and supplies along the Hồ Chí Minh Trail during the war. Today many former loggers work as porters and cave guides.',
    attractions: [
      'Sơn Đoòng Cave',
      'Paradise Cave (Thiên Đường)',
      'Phong Nha Cave by boat',
      'Hang Én',
      'Dark Cave (Hang Tối)',
      'Botanic garden and Mooc spring',
    ],
    activities: [
      'Ride a boat into Phong Nha Cave',
      'Walk the lit boardwalk of Paradise Cave',
      'Camp inside Hang Én on a two-day trek',
      'Zip-line and swim into Dark Cave',
    ],
    foods: [
      { name: 'Cháo canh', description: 'Thick noodle soup with fish and pork.' },
      { name: 'Bánh bột lọc', description: 'Chewy tapioca dumplings with prawn.' },
      { name: 'Grilled pork with forest herbs', description: 'A simple riverside lunch after a cave trek.' },
    ],
    bestTime: 'February to August',
    travelTips: [
      'Many caves close in the flood season, September to November.',
      'Sơn Đoòng expeditions are limited and sell out a year ahead.',
      'Đồng Hới is the nearest airport and train station.',
    ],
  },
  {
    slug: 'nha-trang',
    name: 'Nha Trang',
    localName: 'Nha Trang',
    region: 'central',
    province: 'Khánh Hòa Province',
    coordinates: [109.19, 12.25],
    categories: ['beach', 'city', 'history'],
    description: 'A six-kilometre crescent of sand facing a bay full of islands.',
    longDescription:
      'Nha Trang is Vietnam’s classic beach city. A palm-lined promenade follows the bay, boats leave each morning for the coral reefs around Hòn Mun, and mountains close in behind the town.',
    history:
      'The Po Nagar towers on the north side of the river were built by the Cham between the 7th and 12th centuries and are still used for worship. Alexandre Yersin, who identified the plague bacillus, lived and worked here.',
    culture:
      'A working fishing fleet still shares the river mouth with the resorts, and seafood comes straight from boat to grill.',
    attractions: [
      'Po Nagar Cham towers',
      'Hòn Mun marine reserve',
      'Long Sơn Pagoda',
      'Hòn Tre Island',
      'Ba Hồ waterfalls',
    ],
    activities: [
      'Snorkel or dive at Hòn Mun',
      'Take a boat trip around the bay',
      'Soak in a hot mineral mud bath',
      'Eat grilled seafood on the beach road',
    ],
    foods: [
      { name: 'Bún chả cá', description: 'Noodle soup with fish cake and jellyfish.' },
      { name: 'Nem nướng Ninh Hòa', description: 'Grilled pork skewers rolled in rice paper.' },
      { name: 'Bánh căn', description: 'Small rice cakes cooked in clay moulds.' },
    ],
    bestTime: 'January to August',
    travelTips: [
      'Rain falls mainly from October to December.',
      'Water is clearest for diving from April to August.',
      'Cam Ranh airport is 35 km south of the city.',
    ],
  },
  {
    slug: 'da-lat',
    name: 'Da Lat',
    localName: 'Đà Lạt',
    region: 'central',
    province: 'Lâm Đồng Province',
    coordinates: [108.44, 11.94],
    categories: ['nature', 'architecture', 'food'],
    description: 'A cool highland town of pine forest, flower farms and old villas.',
    longDescription:
      'At 1,500 metres in the Central Highlands, Da Lat has spring weather all year. Pine-covered hills surround Xuân Hương Lake, greenhouses supply the country with flowers, strawberries and artichokes, and coffee grows on the slopes around town.',
    history:
      'The site was scouted by Alexandre Yersin in 1893 and built by the French as a hill resort. Hundreds of villas, a railway station and the summer palaces of the last emperor, Bảo Đại, remain.',
    culture:
      'Da Lat is the favourite honeymoon town of the Vietnamese. The K’Ho people of the surrounding hills grow some of the country’s best arabica.',
    attractions: [
      'Xuân Hương Lake',
      'Lang Biang mountain',
      'Da Lat railway station',
      'Crazy House',
      'Tuyền Lâm Lake and Trúc Lâm monastery',
      'Datanla waterfall',
    ],
    activities: [
      'Go canyoning at Datanla',
      'Visit a K’Ho coffee farm',
      'Hike to the top of Lang Biang',
      'Browse the night market in a jacket',
    ],
    foods: [
      { name: 'Bánh tráng nướng', description: 'Rice paper grilled with egg and toppings.' },
      { name: 'Lẩu gà lá é', description: 'Chicken hotpot with lemon basil.' },
      { name: 'Sữa đậu nành', description: 'Hot soy milk, a night-market habit.' },
    ],
    bestTime: 'November to March',
    travelTips: [
      'Evenings are cool all year. Bring a light jacket.',
      'Afternoon showers are common from May to October.',
      'Buses up from Nha Trang take about three and a half hours.',
    ],
  },
  {
    slug: 'ho-chi-minh-city',
    name: 'Ho Chi Minh City',
    localName: 'Thành phố Hồ Chí Minh',
    region: 'south',
    province: 'Ho Chi Minh City',
    coordinates: [106.7, 10.78],
    categories: ['city', 'food', 'history', 'architecture'],
    description: 'Vietnam’s largest city, fast, generous and always awake.',
    longDescription:
      'Still called Saigon by many who live there, this is the commercial engine of the country. French-era landmarks stand beneath glass towers, alleys hide whole neighbourhoods of cafés and noodle stalls, and the day starts early and ends late.',
    history:
      'Once a Khmer fishing settlement, the city grew under the Nguyễn lords and then as the capital of French Cochinchina. It was the capital of South Vietnam until 1975 and was renamed after reunification.',
    culture:
      'Saigon runs on iced coffee and street food. Chợ Lớn, the historic Chinese quarter, has some of the city’s oldest temples.',
    attractions: [
      'Notre-Dame Cathedral and the Central Post Office',
      'Independence Palace',
      'War Remnants Museum',
      'Bến Thành Market',
      'Chợ Lớn and Thiên Hậu Temple',
      'Củ Chi tunnels',
    ],
    activities: [
      'Join a street-food tour on the back of a scooter',
      'See the skyline from a rooftop bar',
      'Take a day trip to the Củ Chi tunnels',
      'Spend a morning in the cafés of an old apartment block',
    ],
    foods: [
      { name: 'Cơm tấm', description: 'Broken rice with grilled pork chop.' },
      { name: 'Hủ tiếu Nam Vang', description: 'Pork and prawn noodle soup of Khmer-Chinese origin.' },
      { name: 'Bánh xèo', description: 'A large, crisp turmeric pancake.' },
      { name: 'Cà phê sữa đá', description: 'Iced coffee with condensed milk.' },
    ],
    bestTime: 'December to April',
    travelTips: [
      'Ride-hailing apps are the simplest way to get around.',
      'The city’s first metro line opened in late 2024.',
      'Rainy-season downpours are short. Wait them out with a coffee.',
    ],
  },
  {
    slug: 'mekong-delta',
    name: 'Mekong Delta',
    localName: 'Đồng bằng sông Cửu Long',
    region: 'south',
    province: 'Vĩnh Long and Đồng Tháp Provinces',
    coordinates: [106.3, 10.22],
    categories: ['nature', 'culture', 'food'],
    description: 'A green maze of rivers, canals and orchards where life happens on the water.',
    longDescription:
      'The Mekong ends its 4,900 km journey here, splitting into the branches the Vietnamese call the Nine Dragons. The delta is the country’s rice bowl and fruit basket, a flat landscape of coconut groves, fish farms and villages linked by boat.',
    history:
      'The region was part of the Funan and Khmer kingdoms before Vietnamese settlers arrived in the 17th and 18th centuries and dug the canal network that still shapes it.',
    culture:
      'Kinh, Khmer, Chinese and Cham communities live side by side. The delta is the home of đờn ca tài tử, a UNESCO-listed style of southern folk music.',
    attractions: [
      'Bến Tre coconut canals',
      'Cái Bè and the river islands of Mỹ Tho',
      'Trà Sư cajuput forest',
      'Sa Đéc flower village',
      'Sam Mountain at Châu Đốc',
    ],
    activities: [
      'Glide down a narrow canal by sampan',
      'Cycle the shaded paths between orchards',
      'Stay with a family on a river island',
      'Visit workshops making coconut candy and rice paper',
    ],
    foods: [
      { name: 'Cá tai tượng chiên xù', description: 'Whole fried elephant-ear fish, rolled in rice paper.' },
      { name: 'Hủ tiếu Mỹ Tho', description: 'Clear noodle soup with pork and seafood.' },
      { name: 'Tropical fruit', description: 'Rambutan, longan, durian and pomelo straight from the tree.' },
    ],
    bestTime: 'December to April. September to November for the floating season.',
    travelTips: [
      'A day trip from Saigon only reaches the edge. Stay at least one night.',
      'Mornings are when the rivers are busiest.',
      'Bring insect repellent for evenings by the water.',
    ],
  },
  {
    slug: 'can-tho',
    name: 'Can Tho',
    localName: 'Cần Thơ',
    region: 'south',
    province: 'Cần Thơ City',
    coordinates: [105.72, 9.98],
    categories: ['culture', 'food', 'city'],
    description: 'The delta’s capital, known for its floating market at dawn.',
    longDescription:
      'Cần Thơ is the largest city in the Mekong Delta, spread along the Hậu River. Before sunrise, wholesale boats gather at Cái Răng, each flying a sample of its cargo from a bamboo pole, while smaller boats sell coffee and noodles to the traders.',
    history:
      'The city grew as a rice-trading centre under French rule and was long known as Tây Đô, the “western capital” of the south.',
    culture:
      'River trade, orchard gardens and southern folk music define the city. The old market hall and Ninh Kiều wharf are its evening meeting place.',
    attractions: [
      'Cái Răng floating market',
      'Ninh Kiều wharf',
      'Bình Thủy ancient house',
      'Ông Pagoda',
      'Mỹ Khánh orchards',
    ],
    activities: [
      'Take a boat to Cái Răng at 5:30am',
      'Eat breakfast noodles served from a boat',
      'Explore the small canals behind the market',
      'Walk the riverfront night market',
    ],
    foods: [
      { name: 'Bún riêu cua', description: 'Tomato and crab noodle soup, often eaten on the water.' },
      { name: 'Lẩu mắm', description: 'A pungent fermented-fish hotpot with a basket of greens.' },
      { name: 'Bánh cống', description: 'Fried mung bean and prawn cakes.' },
    ],
    bestTime: 'December to April',
    travelTips: [
      'The market is over by 8am, so leave early.',
      'A small private boat lets you reach the narrow canals.',
      'Three to four hours by road from Ho Chi Minh City.',
    ],
  },
  {
    slug: 'phu-quoc',
    name: 'Phu Quoc',
    localName: 'Phú Quốc',
    region: 'south',
    province: 'An Giang Province',
    coordinates: [103.98, 10.24],
    categories: ['beach', 'nature', 'food'],
    description: 'Vietnam’s largest island, ringed with soft sand and warm, calm sea.',
    longDescription:
      'Phú Quốc lies in the Gulf of Thailand, closer to Cambodia than to the Vietnamese mainland. More than half the island is protected forest, the west coast faces the sunset, and the small An Thới islands to the south have the clearest water.',
    history:
      'The island has long been known for two products: fish sauce, made here for over two hundred years, and black pepper. A former prison in the south is now a memorial museum.',
    culture:
      'Fishing villages such as Hàm Ninh still stand on stilts over the water, and squid boats light the horizon at night.',
    attractions: [
      'Sao Beach',
      'An Thới Islands',
      'Phú Quốc National Park',
      'Hòn Thơm cable car',
      'Hàm Ninh fishing village',
      'Dương Đông night market',
    ],
    activities: [
      'Island-hop and snorkel around An Thới',
      'Watch the sunset from Long Beach',
      'Visit a fish sauce house and a pepper farm',
      'Go night fishing for squid',
    ],
    foods: [
      { name: 'Gỏi cá trích', description: 'Raw herring salad with coconut and herbs.' },
      { name: 'Bún quậy', description: 'Noodles with fresh prawn and fish paste, mixed at the table.' },
      { name: 'Nhum nướng', description: 'Sea urchin grilled with spring onion oil.' },
    ],
    bestTime: 'November to April',
    travelTips: [
      'Many nationalities can visit Phú Quốc visa-free for up to 30 days.',
      'The sea is rougher from June to September.',
      'Rent a scooter or hire a driver to reach the quiet beaches.',
    ],
  },
  {
    slug: 'con-dao',
    name: 'Con Dao',
    localName: 'Côn Đảo',
    region: 'south',
    province: 'Ho Chi Minh City',
    coordinates: [106.61, 8.69],
    categories: ['beach', 'history', 'nature'],
    description: 'A remote archipelago of empty beaches, coral reefs and a heavy past.',
    longDescription:
      'Sixteen islands sit 230 km off the southern coast, most of them inside a national park. Forest runs down to deserted bays, sea turtles nest on the outer islands, and the single small town moves at walking pace.',
    history:
      'For 113 years, under French and then South Vietnamese rule, Côn Đảo was a prison island. Thousands of political prisoners were held in its “tiger cages”. Vietnamese visitors come at midnight to honour Võ Thị Sáu at Hàng Dương cemetery.',
    culture:
      'The islands are a place of pilgrimage as much as a beach escape, and the mood is quiet and respectful.',
    attractions: [
      'Côn Đảo prison complex',
      'Hàng Dương cemetery',
      'Đầm Trầu Beach',
      'Bảy Cạnh Island turtle sanctuary',
      'Côn Đảo National Park',
    ],
    activities: [
      'Dive or snorkel on some of Vietnam’s healthiest reefs',
      'Watch turtles nest between May and October',
      'Hike through the forest to Ông Đụng Bay',
      'Ride the coast road by scooter',
    ],
    foods: [
      { name: 'Ốc vú nàng', description: 'A local sea snail, grilled or steamed.' },
      { name: 'Mắm hàu', description: 'Fermented oyster sauce from the islands.' },
      { name: 'Hạt bàng', description: 'Roasted sea-almond seeds, sold salted or sweet.' },
    ],
    bestTime: 'March to September for calm seas',
    travelTips: [
      'Flights are small and fill up fast. Book early.',
      'Bring cash, as there are few ATMs.',
      'Dress and behave respectfully at the cemetery and prison sites.',
    ],
  },
];

export const DESTINATIONS: Destination[] = CONTENT.map((content) => ({
  ...content,
  id: content.slug,
  images: DESTINATION_IMAGES[content.slug] ?? [],
}));

export const DESTINATION_BY_ID: ReadonlyMap<string, Destination> = new Map(
  DESTINATIONS.map((destination) => [destination.id, destination]),
);
