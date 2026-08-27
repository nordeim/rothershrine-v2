/**
 * Canonical site constants — single source for address, contact, and
 * map URLs so Footer + Pilgrimage + any future page cannot drift.
 * Verify against rothershrine.org before changing.
 */
export const site = {
  name: "Blessed Stanley Rother Shrine",
  shortName: "Rother Shrine",
  address: {
    street: "13300 N Kelley Ave",
    city: "Oklahoma City",
    state: "OK",
    zip: "73131",
    get full() {
      return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
    },
    get query() {
      return encodeURIComponent(this.full);
    },
  },
  hours: {
    grounds: "Daily, 9 a.m.–5 p.m.",
    shrineChurch: "Daily, 7 a.m.–7 p.m.",
    chapelOfTomb: "Daily, 8 a.m.–6 p.m.",
    giftShop: "Daily, 9 a.m.–4:30 p.m.",
  },
  contact: {
    email: "info@rothershrine.org",
    pilgrimageEmail: "pilgrimage@rothershrine.org",
    volunteerEmail: "volunteer@rothershrine.org",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=13300+N+Kelley+Ave+Oklahoma+City+OK",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=13300+N+Kelley+Ave,+Oklahoma+City,+OK+73131&output=embed",
} as const;
