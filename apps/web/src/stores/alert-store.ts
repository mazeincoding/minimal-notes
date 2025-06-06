import { create } from "zustand";
import { IAlert } from "@/types/alert";

type AlertStore = {
  createAlert: (alert: IAlert) => void;
  alert: IAlert;
  hideAlert: () => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
  alert: { message: null, title: null, textField: undefined, buttons: [] },
  createAlert: (alert) => {
    // Hide current alert first
    set({
      alert: { message: null, title: null, textField: undefined, buttons: [] },
    });
    // Create new alert after a small delay to allow animation
    setTimeout(() => {
      set({
        alert: {
          message: alert.message,
          title: alert.title,
          textField: alert.textField,
          buttons: alert.buttons,
        },
      });
    }, 200);
  },
  hideAlert: () =>
    set({
      alert: { message: null, title: null, textField: undefined, buttons: [] },
    }),
}));

// Helper function for other stores to use
export const createAlert = (alert: IAlert) => {
  useAlertStore.getState().createAlert(alert);
};
