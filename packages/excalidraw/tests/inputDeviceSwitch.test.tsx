import { Excalidraw } from "../index";

import { fireEvent, getByTestId, render } from "./test-utils";

describe("input device switch", () => {
  it("shows the resolved mode and toggles it on click", async () => {
    const { container } = await render(<Excalidraw />);

    // `auto` (the default) resolves to trackpad until detection exists
    expect(window.h.state.inputDevice).toBe("auto");

    const trigger = getByTestId(container, "input-device-trigger");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Trackpad");

    fireEvent.click(trigger);
    expect(window.h.state.inputDevice).toBe("mouse");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Mouse");

    fireEvent.click(trigger);
    expect(window.h.state.inputDevice).toBe("trackpad");
    expect(trigger.getAttribute("aria-label")).toBe("Input: Trackpad");
  });

  it("toggles from the keyboard", async () => {
    const { container } = await render(<Excalidraw />);

    const trigger = getByTestId(container, "input-device-trigger");
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.keyDown(trigger, { key: "Enter" });
    fireEvent.keyUp(trigger, { key: "Enter" });
    // buttons dispatch click on Enter/Space
    fireEvent.click(trigger);

    expect(window.h.state.inputDevice).toBe("mouse");
  });
});
