import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { AboutRother } from "@/pages/AboutRother";
import { History } from "@/pages/History";
import { WhatToSee } from "@/pages/WhatToSee";
import { Pilgrimage } from "@/pages/Pilgrimage";
import { NewsEvents } from "@/pages/NewsEvents";
import { Volunteer } from "@/pages/Volunteer";
import { Give } from "@/pages/Give";
import { FAQ } from "@/pages/FAQ";
import { NotFound } from "@/pages/NotFound";

/**
 * HashRouter is intentional: this SPA ships as a single static
 * dist/index.html with no server-side rewrites, so deep links like
 * /#/pilgrimage must resolve without host fallback configuration.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          {/* About — canonical + legacy alias */}
          <Route path="about-blessed-stanley-rother" element={<AboutRother />} />
          <Route path="about" element={<AboutRother />} />

          <Route path="history" element={<History />} />

          {/* What to See — canonical + legacy alias */}
          <Route path="what-to-see" element={<WhatToSee />} />
          <Route path="grounds-art-architecture" element={<WhatToSee />} />

          {/* Pilgrimage — canonical + legacy aliases */}
          <Route path="pilgrimage" element={<Pilgrimage />} />
          <Route path="visit-planning" element={<Pilgrimage />} />
          <Route path="hours-location" element={<Pilgrimage />} />

          {/* News & Events — canonical + legacy alias */}
          <Route path="news-events" element={<NewsEvents />} />
          <Route path="news-and-events" element={<NewsEvents />} />

          <Route path="volunteer" element={<Volunteer />} />

          {/* Give — canonical + legacy alias */}
          <Route path="give" element={<Give />} />
          <Route path="shrinegift" element={<Give />} />

          <Route path="faq" element={<FAQ />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
