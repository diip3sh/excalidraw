import { resolveInputDevice } from "../appState";
import { useUIAppState } from "../context/ui-appState";
import { t } from "../i18n";

import { useExcalidrawSetAppState } from "./App";
import { IconButton } from "./IconButton";
import { Tooltip } from "./Tooltip";
import { mouseIcon, trackpadIcon } from "./icons";

/**
 * Input mode switch rendered inside the zoom-controls island in the footer,
 * so switching between trackpad and mouse wheel mappings doesn't require
 * opening the main menu (#12474). A plain toggle button: each activation
 * flips the mode, the icon and tooltip show the active one. `auto` resolves
 * through `resolveInputDevice` until device detection exists — same as the
 * main-menu preference.
 */
export const InputDeviceSwitch = () => {
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();

  const inputDevice = resolveInputDevice(appState.inputDevice);
  const deviceLabel =
    inputDevice === "trackpad"
      ? t("labels.inputDeviceTrackpad")
      : t("labels.inputDeviceMouse");

  return (
    <Tooltip
      label={`${t("labels.inputDevice")}: ${deviceLabel}`}
      className="input-device-button-wrapper"
      delay
    >
      <IconButton
        type="button"
        className="input-device-button zoom-button"
        icon={inputDevice === "trackpad" ? trackpadIcon : mouseIcon}
        aria-label={`${t("labels.inputDevice")}: ${deviceLabel}`}
        data-testid="input-device-trigger"
        onClick={() => {
          setAppState({
            inputDevice: inputDevice === "trackpad" ? "mouse" : "trackpad",
          });
        }}
      />
    </Tooltip>
  );
};

InputDeviceSwitch.displayName = "InputDeviceSwitch";
