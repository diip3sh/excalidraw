import { resolveInputDevice } from "../appState";
import { useUIAppState } from "../context/ui-appState";
import { t } from "../i18n";

import { useExcalidrawSetAppState } from "./App";
import DropdownMenu from "./dropdownMenu/DropdownMenu";
import DropdownMenuItemContentRadio from "./dropdownMenu/DropdownMenuItemContentRadio";
import { mouseIcon, trackpadIcon } from "./icons";

import type { InputDevice } from "../types";

/**
 * Input mode switch rendered beside the zoom controls in the footer, so
 * switching between trackpad and mouse wheel mappings doesn't require
 * opening the main menu (#12474). The trigger shows the active mode;
 * the dropdown offers both explicitly. `auto` stays out of the choices
 * until device detection exists — same as the main-menu preference.
 */
export const InputDeviceSwitch = () => {
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();

  const inputDevice = resolveInputDevice(appState.inputDevice);
  const open = appState.openMenu === "inputDevice";
  const deviceLabel =
    inputDevice === "trackpad"
      ? t("labels.inputDeviceTrackpad")
      : t("labels.inputDeviceMouse");

  return (
    <DropdownMenu open={open}>
      <DropdownMenu.Trigger
        className="input-device-button"
        onToggle={() => {
          setAppState({
            openMenu: open ? null : "inputDevice",
            openPopup: null,
          });
        }}
        title={`${t("labels.inputDevice")}: ${deviceLabel}`}
        aria-label={`${t("labels.inputDevice")}: ${deviceLabel}`}
        data-testid="input-device-trigger"
      >
        {inputDevice === "trackpad" ? trackpadIcon : mouseIcon}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        onClickOutside={() => setAppState({ openMenu: null })}
        onSelect={() => setAppState({ openMenu: null })}
        className="input-device-menu"
        align="start"
      >
        <DropdownMenuItemContentRadio<Exclude<InputDevice, "auto">>
          name="inputDevice"
          // `auto` isn't offered yet; the radio shows what it resolves to
          value={inputDevice}
          onChange={(value) => {
            setAppState({
              inputDevice: value,
            });
          }}
          choices={[
            {
              value: "trackpad",
              label: t("labels.inputDeviceTrackpad"),
              ariaLabel: t("labels.inputDeviceTrackpad"),
            },
            {
              value: "mouse",
              label: t("labels.inputDeviceMouse"),
              ariaLabel: t("labels.inputDeviceMouse"),
            },
          ]}
        >
          {t("labels.inputDevice")}
        </DropdownMenuItemContentRadio>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

InputDeviceSwitch.displayName = "InputDeviceSwitch";
