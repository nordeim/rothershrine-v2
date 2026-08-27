import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Emblem } from "@/components/Emblem";
import { ArrowRight } from "lucide-react";

export function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-shrine-cream py-24">
      <Container className="text-center">
        <Emblem className="mx-auto h-14 w-14 text-shrine-maroon-500" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-shrine-maroon-500">Page Not Found</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-shrine-maroon-700 sm:text-5xl">
          This path doesn't lead to the Shrine.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-shrine-charcoal/80">
          The page you're looking for may have moved. Let's get you back on the pilgrimage.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button to="/" variant="primary" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
            Return Home
          </Button>
          <Button to="/pilgrimage" variant="ghost">
            Plan a Visit
          </Button>
        </div>
      </Container>
    </section>
  );
}
