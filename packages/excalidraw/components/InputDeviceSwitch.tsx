import clsx from "clsx";
import { useRef, useState } from "react";

import { KEYS } from "@excalidraw/common";

import { resolveInputDevice } from "../appState";
import { useUIAppState } from "../context/ui-appState";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { t } from "../i18n";

import { useExcalidrawSetAppState } from "./App";
import { Island } from "./Island";
import { mouseIcon, trackpadIcon } from "./icons";

import type { InputDevice } from "../types";

type ResolvedInputDevice = Exclude<InputDevice, "auto">;

// same class recipe IconButton uses, so the flyout options and the trigger
// look exactly like the neighboring zoom buttons
const TOOL_BUTTON_CLASSES =
  "ToolIcon ToolIcon_type_button ToolIcon_type_button--show ToolIcon_size_medium";

/**
 * Input mode switch rendered inside the zoom-controls island in the footer,
 * so switching between trackpad and mouse wheel mappings doesn't require
 * opening the main menu (#12474). Hovering or clicking the button slides up
 * a small vertical flyout with both modes; the active one is highlighted.
 * `auto` resolves through `resolveInputDevice` until device detection
 * exists — same as the main-menu preference.
 */
export const InputDeviceSwitch = () => {
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // after picking with the pointer, keep the flyout closed until the pointer
  // leaves, so it doesn't instantly reopen under the stationary cursor
  const suppressHoverRef = useRef(false);

  useOutsideClick(rootRef, () => setOpen(false));

  const inputDevice = resolveInputDevice(appState.inputDevice);

  const options: {
    value: ResolvedInputDevice;
    icon: React.ReactNode;
    label: string;
  }[] = [
    {
      value: "trackpad",
      icon: trackpadIcon,
      label: t("labels.inputDeviceTrackpad"),
    },
    {
      value: "mouse",
      icon: mouseIcon,
      label: t("labels.inputDeviceMouse"),
    },
  ];

  const deviceLabel = options.find(
    (option) => option.value === inputDevice,
  )!.label;

  return (
    <div
      ref={rootRef}
      className="input-device-switch"
      onMouseEnter={() => {
        if (!suppressHoverRef.current) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        suppressHoverRef.current = false;
        setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === KEYS.ESCAPE && open) {
          // don't let it reach the canvas (would deselect elements)
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`${TOOL_BUTTON_CLASSES} zoom-button input-device-button`}
        aria-label={`${t("labels.inputDevice")}: ${deviceLabel}`}
        aria-haspopup="true"
        aria-expanded={open}
        data-testid="input-device-trigger"
        onClick={() => setOpen((value) => !value)}
      >
        <div className="ToolIcon__icon">
          {inputDevice === "trackpad" ? trackpadIcon : mouseIcon}
        </div>
      </button>
      <div
        className={clsx("input-device-flyout", {
          "input-device-flyout--open": open,
        })}
      >
        <Island padding={1} className="input-device-flyout__island">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={clsx(
                TOOL_BUTTON_CLASSES,
                "input-device-flyout__option",
                {
                  "input-device-flyout__option--active":
                    option.value === inputDevice,
                },
              )}
              aria-label={option.label}
              aria-pressed={option.value === inputDevice}
              title={option.label}
              data-testid={`input-device-option-${option.value}`}
              onClick={() => {
                setAppState({ inputDevice: option.value });
                suppressHoverRef.current = true;
                setOpen(false);
              }}
            >
              <div className="ToolIcon__icon">{option.icon}</div>
            </button>
          ))}
        </Island>
      </div>
    </div>
  );
};

InputDeviceSwitch.displayName = "InputDeviceSwitch";
