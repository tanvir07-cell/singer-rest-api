// eikhane database er generic term gula thakbe(jate singer , pore jodi user o add kora hoy tar jonneo jate kaaj kore)

import fs from "node:fs/promises";

const DB_PATH = new URL("../db.json", import.meta.url);

export const getDB = async () => {
  try {
    const datas = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(datas);
  } catch (err) {
    console.log(err);
  }
};

export const writeDB = async (db) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (err) {
    console.log(err);
  }
};

export const insert = async (data) => {
  const db = await getDB();
  db.singers.push(data);
  await writeDB(db);
  return data;
};
