import urbitAPI from "./urbitAPI";

export function openAirlock(onEvent, onClose) {
  urbitAPI
    .subscribe({
      app: "keep",
      path: "/website",
      event: (data) => {
        onEvent(data);
      },
    })
    .then((sub) => {
      onClose(sub);
    });
}

export function closeAirlock(subscription, onClose) {
  urbitAPI.unsubscribe(subscription).then(() => {
    onClose;
  });
}
