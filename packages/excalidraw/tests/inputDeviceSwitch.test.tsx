import { Excalidraw } from "../index";

import { fireEvent, getByTestId, render } from "./test-utils";

describe("input device switch", () => {
  it("opens the flyout on click and switches the mode from it", async () => {
    const { container } = await render(<Excalidraw />);

    // `auto` (the default) resolves to trackpad until detection exists
    expect(window.h.state.inputDevice).toBe("auto");

    const trigger = getByTestId(container, "input-device-trigger");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Trackpad");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(getByTestId(container, "input-device-option-mouse"));

    expect(window.h.state.inputDevice).toBe("mouse");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Mouse");
    // closes after picking
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    fireEvent.click(getByTestId(container, "input-device-option-trackpad"));

    expect(window.h.state.inputDevice).toBe("trackpad");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Trackpad");
  });

  it("opens on hover and closes on outside pointer down", async () => {
    const { container } = await render(<Excalidraw />);
    const canvas = container.querySelector<HTMLCanvasElement>("canvas")!;

    const trigger = getByTestId(container, "input-device-trigger");
    fireEvent.mouseEnter(trigger.parentElement!);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    fireEvent.pointerDown(canvas);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("is keyboard operable and closes on Escape", async () => {
    const { container } = await render(<Excalidraw />);

    const trigger = getByTestId(container, "input-device-trigger");
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    // buttons dispatch click on Enter
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    const mouseOption = getByTestId(container, "input-device-option-mouse");
    mouseOption.focus();
    fireEvent.click(mouseOption);
    expect(window.h.state.inputDevice).toBe("mouse");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(trigger.parentElement!, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });
});
