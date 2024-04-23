/**
 * @notice The anki card is shown in the following way:
 * 1. The front of the card is shown
 * 2. When the user clicks anywhere on the notification, the back of the card is shown
 * 3. When the user clicks "Show question" the front of the card is shown
 * 4. When the user clicks "Show answer" the back of the card is shown
 * 5. The notification closes when the user clicks anywhere except the "Show question" button on the back of the card
 *
 * This is done for a couple of reasons:
 * 1. Notifications are not persistent and will close according to the user's system settings
 *    regardless of user interaction/non-interaction and no matter what you define in the XML.
 *
 * 2. In order to make the notification "persistent" they are tricked into a loop where
 *    auto-dismissed cards actually just flip the card. Trying to manually dismiss using
 *    the close button will also flip the card.
 *
 * 3. So in order for the notification to be truly closed, the user must first flip the card
 *    inherently reading the question and then must click on the answer itself to close the notification.
 *
 * 4. In this way it is unavoidable for the user to read the question and answer otherwise the notification
 *    will continue to flip the card until the user at the very least acknowledges the notification. Subliminally
 *    if nothing else, the knowledge will be absorbed.
 */

import { CardSetGenre, importAllFromCardSetGenre } from "../constants/cards";
import { Card, CardsConfig } from "./shared";
import { JWashamCards } from "./jwasham-cards";

export type CardHandler = Object & {
  getRandomCard: () => Card;
  notify: (card: Card) => void;
  waitForCards: () => Promise<void>;
};

export class Notifications {
  private activeSets: Set<string> = new Set();
  private genres: CardSetGenre[] = [];
  private JWashamCards: JWashamCards;
  private app: Electron.App;

  constructor(config: CardsConfig) {
    const { genres: _genres } = config;

    if (!_genres) {
      throw new Error("_Genres must be provided.");
    }

    if (!Array.isArray(_genres)) {
      this.genres = [_genres];
    }

    if (Array.isArray(_genres)) {
      this.genres = _genres;
    }

    this.app = config.app;

    this.JWashamCards = new JWashamCards(config.app);
  }

  consoleLoader() {
    const steps = ["| ", "/ ", "- ", "\\ ", "| ", "/ ", "- ", "\\ "];
    let i = 4;

    return setInterval(() => {
      process.stdout.write("\r" + steps[i++]);
      i &= 7;
    }, 100);
  }

  async launch(): Promise<void> {
    await this.JWashamCards.waitForCards();
    // Show the first card
    this.pluckRandomCard();

    setInterval(() => {
      this.pluckRandomCard();
    }, 2 * 60 * 1000); // Show notification every minute: TODO: Make this configurable
  }

  async pluckRandomCard(): Promise<void> {
    return this.JWashamCards.pluckAndDisplay();
  }
}
