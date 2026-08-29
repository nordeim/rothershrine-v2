import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== "BUTTON") return;
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("button[aria-expanded]"),
    );
    const currentIndex = buttons.indexOf(target as HTMLButtonElement);
    if (currentIndex === -1) return;
    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case "ArrowUp":
        event.preventDefault();
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        event.preventDefault();
        nextIndex = buttons.length - 1;
        break;
      default:
        return;
    }
    if (nextIndex !== null) buttons[nextIndex]?.focus();
  };

  return (
    <div
      className="divide-y divide-shrine-stone border-y border-shrine-stone"
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-lg font-semibold text-shrine-maroon-700 sm:text-xl">
                  {item.question}
                </span>
                <Plus
                  className={cn(
                    "h-5 w-5 shrink-0 text-shrine-gold-600 transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={isOpen ? undefined : true}
              inert={!isOpen ? true : undefined}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-6 text-base leading-relaxed text-shrine-charcoal/85">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
