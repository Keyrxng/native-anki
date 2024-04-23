import { Notification } from "electron";
import { Database } from "sqlite3";
import { Card } from "./shared";

/**
 * https://github.com/jwasham/coding-interview-university
 *
 * > Note this is a study plan for software engineering, not frontend engineering or full-stack development.
 * > I DON'T RECOMMEND using my flashcards. There are too many and most of them are trivia that you don't need.
 * > But if you don't want to listen to me, here you go:
 *
 * We have not listened although it is not the "Extreme" version, this is the ~1200 cards version.
 * It has cards covering everything from assembly language and Python trivia to machine learning and statistics.
 */

export class JWashamCards {
  app: Electron.App;
  db: Database;
  cards: Card[] = [];
  lastSeenCard: Card | null = null;

  constructor(app: Electron.App) {
    this.app = app;
    this.db = new Database("cards/software-engineer/jwasham.db", (err) => {
      if (err) {
        console.log(err.message);
      }
    });

    this.db.run(`CREATE TABLE IF NOT EXISTS cards (
        ID INTEGER PRIMARY KEY,
        Type INTEGER,
        front TEXT,
        back TEXT,
        known INTEGER
        )`);

    this.loadCards();
  }

  private loadCards(): void {
    this.db.serialize(() => {
      this.db.each(`SELECT * FROM cards`, (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        const card: Card = row as Card;
        this.cards.push(card);
      });
    });
  }

  public pluckAndDisplay(): void {
    const card = this.getRandomCard();
    this.notify(card);
  }

  public getRandomCard(): Card {
    const data = this.cards[Math.floor(Math.random() * this.cards.length)];
    return data;
  }

  public async waitForCards(): Promise<void> {
    while (this.cards.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  notify(card: Card): void {
    if (process.platform === "win32") {
      this.app.setAppUserModelId("Anki-Notifi");
    }

    const frontCardToast = this.createToast(card, true);
    const backCardToast = this.createToast(card, false);

    frontCardToast.show();

    // show the backcard when anywhere is clicked
    frontCardToast.on("click", () => {
      backCardToast.show();
    });

    // anywhere except the show question button
    backCardToast.on("click", () => {
      backCardToast.close();
    });

    // show the backcard when the show answer button is clicked
    frontCardToast.on("close", () => {
      backCardToast.show();
    });

    // show the frontcard when the show question button is clicked
    backCardToast.on("close", () => {
      frontCardToast.show();
    });
  }

  getToastXml(front = true, text: string, title: string) {
    const templates = {
      front: `
<toast>
    <visual>
        <binding template="ToastText03">
          <text id="1">${title} - Question</text>
          <text id="2">${text}</text>
        </binding>
    </visual>
    <actions>
        <action
            content="Show answer"
            arguments="flip_card"
            activationType="background"/>
    </actions>
    <audio silent="false" />
    <duration value="3600000" />
</toast>`,
      back: `
<toast>
    <visual>
        <binding template="ToastText03">
        <text id="1">${title} - Answer</text>
        <text id="2">${text}</text>
        </binding>
    </visual>
    <actions>
        <action
          content="Show question"
          arguments="flip_card"
          activationType="background"/>
    </actions>
    <audio silent="false" />
    <duration value="3600000" />
</toast>`,
    };

    return templates[front ? "front" : "back"];
  }

  createToast(card: Card, front = true) {
    const title = this.typeHandler(card.type);

    const toastXml = this.getToastXml(
      front,
      front ? card.front : card.back,
      title
    );

    const toast = new Notification({
      timeoutType: "never",
      title,
      body: front ? card.front : card.back,
      toastXml: toastXml,
    });

    return toast;
  }

  /**
   *
   * JWashamCards are typed by 1 || 2 meaning "general" and "code" respectively.
   * One handler to rule them all or different handlers for each card set?
   */
  typeHandler(type: number): string {
    switch (type) {
      case 1:
        return "General";
      case 2:
        return "Code";
      default:
        return "Unknown";
    }
  }

  close(): boolean {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
        return false;
      }
    });
    return true;
  }
}
