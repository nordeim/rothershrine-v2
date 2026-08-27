import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "@/components/ui/Accordion";

const items = [
  { question: "Q1", answer: "A1" },
  { question: "Q2", answer: "A2" },
  { question: "Q3", answer: "A3" },
];

describe("Accordion", () => {
  it("opens first item by default and toggles on click", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const btn1 = screen.getByRole("button", { name: /Q1/ });
    expect(btn1).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: /Q2/ }));
    expect(screen.getByRole("button", { name: /Q2/ })).toHaveAttribute("aria-expanded", "true");
    expect(btn1).toHaveAttribute("aria-expanded", "false");
  });

  it("ArrowDown moves focus to next header", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const btn1 = screen.getByRole("button", { name: /Q1/ });
    const btn2 = screen.getByRole("button", { name: /Q2/ });
    btn1.focus();
    expect(btn1).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(btn2).toHaveFocus();
  });

  it("ArrowUp moves focus to previous header (wraps)", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const btn1 = screen.getByRole("button", { name: /Q1/ });
    const btn3 = screen.getByRole("button", { name: /Q3/ });
    btn1.focus();
    await user.keyboard("{ArrowUp}");
    expect(btn3).toHaveFocus();
  });

  it("Home moves focus to first and End to last", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const btn1 = screen.getByRole("button", { name: /Q1/ });
    const btn2 = screen.getByRole("button", { name: /Q2/ });
    const btn3 = screen.getByRole("button", { name: /Q3/ });
    btn2.focus();
    await user.keyboard("{Home}");
    expect(btn1).toHaveFocus();
    await user.keyboard("{End}");
    expect(btn3).toHaveFocus();
  });
});
