import * as fs from "fs";

/**
 * reads the contents of a directory
 * returns an array of file names
 */
export async function dirReader(dir: string): Promise<string[]> {
  try {
    return await fs.promises.readdir(dir);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fileReader(file: string): Promise<string> {
  try {
    return await fs.promises.readFile(file, "utf-8");
  } catch (err) {
    console.error(err);
    return "";
  }
}
