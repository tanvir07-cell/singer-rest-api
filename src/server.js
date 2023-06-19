import express from "express";
import morgan from "morgan";
import cors from "cors";
import {
  createSinger,
  deleteSingerById,
  getSingerById,
  getSingers,
  updateOrCreateSingerById,
  updateSingerById,
} from "./singers.js";
import shortid from "shortid";

const app = express();

const PORT = process.env.PORT || 4000;

// middleware:
app.use([express.json(), morgan("dev"), cors()]);

// health check:
app.get("/health", async (_req, res) => {
  const health = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try {
    res.status(200).json(health);
  } catch (err) {
    health.message = err;
    res.status(503).json(health.message);
  }
});

// params wala api gula age likha valo:
// get singer by id:
app.get("/api/v1/singers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singer = await getSingerById(id);
    if (!singer) {
      return res.status(404).json({ message: `${id} id singer is not found` });
    }
    return res.status(200).json({ message: "Singer found", singer: singer });
  } catch (err) {
    console.log(err.message);
  }
});

// delete singer by id:

app.delete("/api/v1/singers/:id", async (req, res) => {
  const { id } = req.params;
  const singer = await deleteSingerById(id);
  if (!singer) {
    return res.status(404).json({ message: `${id} id singer is not found` });
  }
  return res.status(200).end();
});

app.patch("/api/v1/singers/:id", async (req, res) => {
  try {
    const updatedSinger = await updateSingerById(req.params.id, req.body);
    if (!updatedSinger) {
      return res.status(404).json({ message: `${id} id singer is not found` });
    }
    return res
      .status(200)
      .json({ message: "Singer updated successfully", singer: updatedSinger });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ message: `${err.message}` });
  }
});

app.put("/api/v1/singers/:id", async (req, res) => {
  try {
    const updatedSinger = await updateOrCreateSingerById(
      req.params.id,
      req.body
    );
    if (!updatedSinger) {
      const data = {
        ...req.body,
      };
      await updateOrCreateSingerById((id = ""), data);
      return res
        .status(201)
        .json({ message: "Singer created successfully", singer: data });
    }
    return res
      .status(200)
      .json({ message: "Singer updated successfully", singer: updatedSinger });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ message: `${err.message}` });
  }
});

// create a singer api:
app.post("/api/v1/singers", async (req, res) => {
  const data = {
    ...req.body,
    id: shortid.generate(),
  };

  try {
    await createSinger(data);
    return res
      .status(201)
      .json({ message: "Singer created successfully", data: data });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ message: `${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// get all singers api:
app.get("/api/v1/singers", async (_req, res) => {
  try {
    const singers = await getSingers();
    if (!singers) {
      return res.status(404).json({ message: "No singer found" });
    }
    return res.status(200).json({ singers: singers });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({ message: err.message });
  }
});
