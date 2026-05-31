export const toastEvents = {
  emit: (message, type = "error") => {
    window.dispatchEvent(
      new CustomEvent("global-toast", { detail: { message, type } }),
    );
  },
};
