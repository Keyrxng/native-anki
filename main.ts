import { app } from "electron";
import { Notifications } from "./types/notifications";

const notifications = new Notifications({
  app,
  genres: ["software-engineer"],
});

/**
 * App initialization
 *
 * Because windows cannot be created before the ready event `activate` events should be listened
 * for _after_ the app is initialized inside the callback.
 */

console.profile("App initialization");
app.whenReady().then(async () => {
  await notifications.launch();
});

console.profileEnd("App initialization");
