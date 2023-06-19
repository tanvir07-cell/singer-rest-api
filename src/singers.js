import shortid from "shortid";
import { getDB, insert, writeDB } from "./db.js";

export const createSinger = async (data) => {
  try {
    await insert(data);
  } catch (err) {
    console.log(err);
  }
};

export const getSingers = async () => {
  const { singers } = await getDB();
  return singers;
};

export const getSingerById = async (id) => {
  const singers = await getSingers();

  const singer = singers.find((singer) => singer.id === id);
  return singer;
};

// update singer user's specific data using patch in the server.js file:

// export const updateSingerById = async (id, data) => {
//   const singer = await getSingerById(id);
//   if (singer) {
//     singer.name = data.name ? data.name : singer.name;
//     singer.song = data.song ? data.song : singer.song;
//     const singers = getSingers();
//     await writeDB({ singers });
//     return singer;
//   }
// };

// delete a specific singer:

export const deleteSingerById = async (id) => {
  const singer = await getSingerById(id);
  if (singer) {
    const singers = await getSingers();
    const newSingers = singers.filter((singer) => singer.id !== id);
    await writeDB({ singers: newSingers });
    return singer;
  }
};

// update a specific singer information using patch in the server.js:
export const updateSingerById = async (id, data) => {
  const singers = await getSingers();

  const singer = singers.find((singer) => singer.id === id);
  singer.name = data.name ? data.name : singer.name;
  singer.songName = data.songName ? data.songName : singer.songName;
  await writeDB({ singers: singers });
  return singer;
};

// update or create a singer using put in the server.js:
export const updateOrCreateSingerById = async (id, data) => {
  const singers = await getSingers();

  const singer = singers.find((singer) => singer.id === id);

  if (singer) {
    singer.name = data.name ? data.name : singer.name;
    singer.songName = data.songName ? data.songName : singer.songName;
    await writeDB({ singers: singers });
    return singer;
  } else {
    const newSinger = {
      ...data,
      id: shortid.generate(),
    };
    await insert(newSinger);
    return newSinger;
  }
};
