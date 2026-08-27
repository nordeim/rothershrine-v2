export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export const lifeTimeline: TimelineEntry[] = [
  {
    year: "1935",
    title: "Born in Okarche, Oklahoma",
    description:
      "Stanley Francis Rother was born on March 27, 1935, the eldest of four children raised on a wheat and dairy farm outside Okarche, a small farming community of Czech and German heritage northwest of Oklahoma City.",
  },
  {
    year: "1963",
    title: "Ordained a Priest",
    description:
      "After early struggles with Latin coursework led one seminary to dismiss him, Stanley persevered and was ordained for the Diocese of Oklahoma City on May 25, 1963. Parishioners remembered him less for eloquent homilies than for a quiet, practical faith and a gift for fixing anything with his hands.",
  },
  {
    year: "1968",
    title: "Missionary to Guatemala",
    description:
      "Stanley volunteered to join the Oklahoma diocesan mission in Santiago Atitlán, Guatemala, serving the Tz'utujil Maya people on the shore of Lake Atitlán. He learned Spanish and, remarkably, the difficult Tz'utujil language, eventually helping translate the New Testament for a people who had never had Scripture in their own tongue.",
  },
  {
    year: "1968–1981",
    title: "Farmer, Builder, Shepherd",
    description:
      "Known to his parish as 'Padre Apla's' — a Tz'utujil rendering of his middle name, Francisco — he worked beside farmers in the fields, helped build a hospital, a school, a farmers' co-op, and the first Catholic radio station in the region, all while serving as pastor to tens of thousands.",
  },
  {
    year: "1980–1981",
    title: "Violence and a Choice to Stay",
    description:
      "As Guatemala's civil war intensified, catechists and parishioners of Santiago Atitlán were kidnapped or killed, and Father Rother's name appeared on a death list. He returned briefly to Oklahoma for safety in January 1981, but chose to go back to his parish for Holy Week, telling his family the shepherd should not run at the first sign of danger.",
  },
  {
    year: "1981",
    title: "Martyrdom",
    description:
      "In the early hours of July 28, 1981, three armed men entered the rectory in Santiago Atitlán and killed Father Rother. He was 46 years old. At his family's request, his body was returned to Okarche for burial, while his heart — at the request of his parishioners — remains enshrined in the church he served in Guatemala.",
  },
  {
    year: "2016–2017",
    title: "Recognized as a Martyr",
    description:
      "Pope Francis formally recognized Stanley Rother's martyrdom in December 2016. He was beatified on September 23, 2017, in Oklahoma City — the first martyr and the first U.S.-born priest to be beatified.",
  },
  {
    year: "2023",
    title: "The National Shrine Opens",
    description:
      "The National Shrine of Blessed Stanley Rother opened to pilgrims in Oklahoma City, built to welcome visitors to learn his story, pray at his tomb, and walk the grounds of Tepeyac Hill.",
  },
];

export interface WhatToSeeSection {
  id: string;
  title: string;
  summary: string;
  details: string[];
  image: string;
  imageAlt: string;
}

export const whatToSee: WhatToSeeSection[] = [
  {
    id: "pilgrim-center",
    title: "Pilgrim Center",
    summary:
      "The welcome point for every visitor — an exhibit hall tracing Blessed Stanley's life from an Oklahoma farm to a Guatemalan highland parish, a gift shop, and a café for pilgrims arriving after a long drive or a long flight.",
    details: [
      "Interactive exhibits on his childhood, priesthood, and mission in Guatemala",
      "Artifacts on loan from the Rother family and the Diocese archives",
      "Gift shop with devotional items, books, and Guatemalan handcrafts",
      "Group orientation room for pilgrimage leaders and school tours",
    ],
    image:
      "https://images.pexels.com/photos/5825353/pexels-photo-5825353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    imageAlt: "Sunlit stone hall with tall arched passages and a hanging chandelier",
  },
  {
    id: "shrine-church",
    title: "Shrine Church & Chapel",
    summary:
      "A soaring worship space seating over a thousand pilgrims, connected to the intimate Chapel of the Tomb, where Blessed Stanley's relics rest beneath a hand-carved altar within reach of quiet, personal prayer.",
    details: [
      "Daily and Sunday Mass open to the public",
      "The Tomb Chapel, open for private prayer during visiting hours",
      "Stained glass and mosaic work depicting his life and the Guatemalan mission",
      "A pipe organ under construction to lead the community in song",
    ],
    image:
      "https://images.pexels.com/photos/28892492/pexels-photo-28892492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    imageAlt: "Vibrant stained glass windows glowing inside a cathedral nave",
  },
  {
    id: "tepeyac-hill",
    title: "Tepeyac Hill",
    summary:
      "A landscaped devotional hill named for the hill in Mexico City associated with Our Lady of Guadalupe, with a rosary walk, native gardens, and an amphitheater used for outdoor Mass, feast day celebrations, and traditional Guatemalan danza performances.",
    details: [
      "Rosary walk with stations set among native Oklahoma plantings",
      "Outdoor amphitheater for feast day Masses and processions",
      "Space reserved for danza groups honoring Guatemalan tradition — request a performance slot",
      "Accessible paths connecting the hill to the Pilgrim Center and Shrine Church",
    ],
    image:
      "https://images.pexels.com/photos/28156382/pexels-photo-28156382.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    imageAlt: "A stone pathway winding through a lush garden at sunset",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Is the Shrine open to the public every day?",
    answer:
      "Yes. The Pilgrim Center, Shrine Church, and grounds are open daily. The Chapel of the Tomb keeps slightly shorter hours to accommodate private prayer and scheduled Masses — see Plan Your Visit for the current schedule.",
  },
  {
    question: "Is there a cost to visit?",
    answer:
      "General admission to the Pilgrim Center, Shrine Church, and Tepeyac Hill is free. Guided group tours can be arranged in advance through the pilgrimage office, and a free-will offering is always welcome.",
  },
  {
    question: "Can I attend Mass at the Shrine?",
    answer:
      "Daily and Sunday Masses are celebrated in the Shrine Church and are open to everyone, pilgrim or parishioner. Confessions are heard before most weekend Masses. Check the current Mass schedule before you travel, as times shift seasonally around major feasts.",
  },
  {
    question: "How long should we plan for a group pilgrimage?",
    answer:
      "Most groups spend two to three hours to see the exhibits, pray in the Chapel of the Tomb, and walk Tepeyac Hill. Groups adding Mass, a meal, or a Guatemalan cultural presentation should plan for half a day.",
  },
  {
    question: "Is the Shrine accessible?",
    answer:
      "Yes. The Pilgrim Center, Shrine Church, and the main paths on Tepeyac Hill are wheelchair accessible, with accessible parking near the main entrance and companion seating available in the church.",
  },
  {
    question: "Where is Blessed Stanley Rother buried?",
    answer:
      "His body rests beneath the altar of the Chapel of the Tomb at the Shrine in Oklahoma City. At the request of the community he served, his heart remains enshrined in the parish church of Santiago Atitlán, Guatemala.",
  },
];

export interface EventItem {
  date: string;
  title: string;
  location: string;
  description: string;
  category: "Feast" | "Pilgrimage" | "Formation" | "Community";
}

export const upcomingEvents: EventItem[] = [
  {
    date: "July 28",
    title: "Feast Day Mass & Celebration",
    location: "Shrine Church & Tepeyac Hill",
    category: "Feast",
    description:
      "The Shrine's principal feast, marking the anniversary of Blessed Stanley's martyrdom, with a bilingual Mass, a Guatemalan danza procession on Tepeyac Hill, and a parish potluck on the grounds.",
  },
  {
    date: "First Saturday, monthly",
    title: "Pilgrim Rosary Walk",
    location: "Tepeyac Hill Rosary Path",
    category: "Pilgrimage",
    description:
      "A guided, meditative walk of the rosary along Tepeyac Hill's outdoor stations, open to individuals and groups. Meet at the Pilgrim Center welcome desk fifteen minutes before the start time.",
  },
  {
    date: "September – November",
    title: "TASTE: A Guatemalan Table",
    location: "Pilgrim Center Café",
    category: "Community",
    description:
      "A rotating seasonal series pairing traditional Guatemalan dishes with short reflections on Padre Apla's ministry among the Tz'utujil, prepared with recipes from the Santiago Atitlán community.",
  },
  {
    date: "Quarterly, Thursday evenings",
    title: "Venerable Voices Speaker Series",
    location: "Pilgrim Center Orientation Room",
    category: "Formation",
    description:
      "Visiting scholars, missionaries, and members of the Rother family share formation talks on martyrdom, mission, and the road to sainthood — free and open to the public, with livestream for remote parish groups.",
  },
];

export interface GivingOption {
  name: string;
  description: string;
  icon: "flame" | "church" | "sprout" | "heart" | "book" | "hand-heart" | "landmark" | "globe";
}

export const givingOptions: GivingOption[] = [
  {
    name: "General Fund",
    description: "Sustains daily operations of the Pilgrim Center, Shrine Church, and grounds for every visitor.",
    icon: "flame",
  },
  {
    name: "Pipe Organ Campaign",
    description: "Completes the Shrine Church's pipe organ, built to lead pilgrims and parishioners in song for generations.",
    icon: "church",
  },
  {
    name: "Apla's Circle",
    description: "A monthly giving circle named for Padre Apla's, sustaining the Shrine's mission with recurring support.",
    icon: "hand-heart",
  },
  {
    name: "Tepeyac Hill Gardens",
    description: "Maintains the native plantings, rosary walk, and amphitheater that welcome outdoor pilgrims and feast crowds.",
    icon: "sprout",
  },
  {
    name: "Guatemalan Mission Partnership",
    description: "Supports the parish of Santiago Atitlán and the Tz'utujil communities Padre Apla's served and loved.",
    icon: "globe",
  },
  {
    name: "Pilgrim Scholarship Fund",
    description: "Underwrites travel costs for school groups and low-income parishes making the pilgrimage to Oklahoma City.",
    icon: "book",
  },
  {
    name: "Docent & Volunteer Fund",
    description: "Trains and equips the volunteer docents, greeters, and grounds stewards who welcome every pilgrim.",
    icon: "heart",
  },
  {
    name: "Legacy & Planned Giving",
    description: "Estate gifts, charitable trusts, and memorial bequests that secure the Shrine's future for the next century.",
    icon: "landmark",
  },
];
