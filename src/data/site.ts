/**
 * Canonical site constants — single source for address, contact, and
 * map URLs so Footer + Pilgrimage + any future page cannot drift.
 * Verified against rothershrine.org hours-location (2026).
 */
export const site = {
  name: "Blessed Stanley Rother Shrine",
  shortName: "Rother Shrine",
  address: {
    street: "700 SE 89th St",
    city: "Oklahoma City",
    state: "OK",
    zip: "73149",
    get full() {
      return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
    },
    get query() {
      return encodeURIComponent(this.full);
    },
  },
  hours: {
    grounds: "Daily, 9 a.m.–5 p.m.",
    shrineChurch: "Open during Mass and visiting hours",
    chapelOfTomb: "Daily during shrine hours",
    giftShop: "Daily, 9 a.m.–5 p.m.",
    museum: "Daily, 9 a.m.–5 p.m.",
  },
  mass: {
    saturday: "5:00 p.m. English",
    sunday: ["9:00 a.m. English", "11:00 a.m. Spanish", "1:00 p.m. Spanish", "6:00 p.m. Spanish"],
    daily: "Monday–Saturday, 12:15 p.m. English",
    confession: "45 minutes before every Mass",
    adoration: "Monday–Saturday, 1:00–2:00 p.m.",
  },
  contact: {
    phone: "(405) 421-9800",
    email: "info@rothershrine.org",
    pilgrimageEmail: "pilgrimage@rothershrine.org",
    volunteerEmail: "volunteer@rothershrine.org",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=700+SE+89th+St+Oklahoma+City+OK+73149",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=700+SE+89th+St,+Oklahoma+City,+OK+73149&output=embed",
} as const;
