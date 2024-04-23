import { CardSetGenre } from "../constants/cards";

export type Card = {
  id: number;
  type: number;
  front: string;
  back: string;
  known: boolean;
};

export type CardsConfig = {
  genres: CardSetGenre[] | CardSetGenre;
  app: Electron.App;
};
