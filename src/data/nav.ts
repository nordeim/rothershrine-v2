export interface NavLink {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  to: string;
  description?: string;
  children?: (NavLink & { description?: string })[];
}

export const primaryNav: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    to: "/about-blessed-stanley-rother",
    children: [
      {
        label: "Blessed Stanley Rother",
        to: "/about-blessed-stanley-rother",
        description: "The farm boy from Okarche who became a martyr.",
      },
      {
        label: "History of the Shrine",
        to: "/history",
        description: "From beatification in 2017 to the Shrine's opening.",
      },
      {
        label: "FAQ",
        to: "/faq",
        description: "Hours, cost, accessibility, and burial questions.",
      },
    ],
  },
  {
    label: "What to See",
    to: "/what-to-see",
    children: [
      {
        label: "Pilgrim Center",
        to: "/what-to-see#pilgrim-center",
        description: "Exhibits, gift shop, and café.",
      },
      {
        label: "Shrine Church & Chapel",
        to: "/what-to-see#shrine-church",
        description: "Worship space and the Chapel of the Tomb.",
      },
      {
        label: "Tepeyac Hill",
        to: "/what-to-see#tepeyac-hill",
        description: "Rosary walk, gardens, and outdoor amphitheater.",
      },
    ],
  },
  { label: "Pilgrimage", to: "/pilgrimage" },
  { label: "News & Events", to: "/news-events" },
  { label: "Volunteer", to: "/volunteer" },
];

export const footerNav: NavLink[] = [
  { label: "Rector's Welcome", to: "/about-blessed-stanley-rother" },
  { label: "Location & Schedules", to: "/pilgrimage#visit" },
  { label: "History", to: "/history" },
  { label: "FAQ", to: "/faq" },
  { label: "Pilgrim Center", to: "/what-to-see#pilgrim-center" },
  { label: "Shrine Church & Chapel", to: "/what-to-see#shrine-church" },
  { label: "Tepeyac Hill", to: "/what-to-see#tepeyac-hill" },
  { label: "News & Events", to: "/news-events" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Give", to: "/give" },
];
