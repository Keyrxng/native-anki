import { Notifications } from "./types/notifications";

(async () => {
  const notifications = new Notifications({
    genres: ["software-engineer"],
  });

  await notifications.init();
})().catch(console.error);
