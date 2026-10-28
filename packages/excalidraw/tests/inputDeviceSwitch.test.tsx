import { Excalidraw } from "../index";

import { fireEvent, getByTestId, render, waitFor } from "./test-utils";

describe("input device switch", () => {
  it("shows the resolved mode in the trigger and changes it from the dropdown", async () => {
    const { container } = await render(<Excalidraw />);

    // `auto` (the default) resolves to trackpad until detection exists
    expect(window.h.state.inputDevice).toBe("auto");

    const trigger = getByTestId(container, "input-device-trigger");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Trackpad");

    fireEvent.click(trigger);
    expect(window.h.state.openMenu).toBe("inputDevice");

    await waitFor(() => {
      expect(
        container.querySelector('[data-testid="dropdown-menu"]'),
      ).not.toBeNull();
    });

    fireEvent.click(
      container.querySelector<HTMLInputElement>(
        '[data-testid="dropdown-menu"] input[aria-label="Mouse"]',
      )!,
    );

    expect(window.h.state.inputDevice).toBe("mouse");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Mouse");
  });

  it("closes on outside click", async () => {
    const { container } = await render(<Excalidraw />);
    const canvas = container.querySelector<HTMLCanvasElement>("canvas")!;

    fireEvent.click(getByTestId(container, "input-device-trigger"));
    expect(window.h.state.openMenu).toBe("inputDevice");

    fireEvent.pointerDown(canvas);
    await waitFor(() => {
      expect(window.h.state.openMenu).toBe(null);
    });
  });
});
