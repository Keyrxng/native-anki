import { Database } from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { dirReader } from "../utils/files";

export const CARD_SETS: Record<string, number[]> = {
  jwasham: [1], // JWashamCards
  // @TODO: add more card sets
};

export type CardSetNames = keyof typeof CARD_SETS;
export type CardSetIds = (typeof CARD_SETS)[CardSetNames];

export const CARD_SET_NAMES = Object.keys(CARD_SETS) as CardSetNames[];
export const CARD_SET_IDS = Object.values(CARD_SETS) as CardSetIds[];

const CARD_BASE_PATH = "cards/";

const CARD_SET_GENRES = {
  "software-engineer": "Software Engineer",
  "frontend-developer": "Frontend Developer",
  "backend-developer": "Backend Developer",
  "full-stack-developer": "Full-Stack Developer",

  "smart-contract-security": "Smart Contract Security",
  "blockchain-developer": "Blockchain Developer",
  "blockchain-security": "Blockchain Security",
};

export type CardSetGenre = keyof typeof CARD_SET_GENRES extends string
  ? keyof typeof CARD_SET_GENRES
  : never;

export const CARD_SET_GENRES_KEYS = Object.keys(
  CARD_SET_GENRES
) as (keyof typeof CARD_SET_GENRES)[];
export const CARD_SET_GENRES_ROLES = Object.values(
  CARD_SET_GENRES
) as (typeof CARD_SET_GENRES)[keyof typeof CARD_SET_GENRES][];
export const CARD_SET_GENRES_PATHS = CARD_SET_GENRES_KEYS.map(
  (genre) => `${CARD_BASE_PATH}${genre}/`
);

function getCardSetGenrePath(genre: keyof typeof CARD_SET_GENRES): string {
  return `${CARD_BASE_PATH}${genre}/`;
}

/**
 * Imports all from a card set genre.
 * @param genre - The genre of the card set.
 * @returns A promise that resolves to the imported data.
 */
export async function importAllFromCardSetGenre<T extends CardSetGenre>(
  genre: T extends CardSetGenre ? T : never
): Promise<any> {
  const str = `${__dirname}/../${getCardSetGenrePath(genre)}`;
  const fileNames = await dirReader(str);

  return fileNames.map((fileName) => {
    return fileName.split(".")[0];
  });
}
