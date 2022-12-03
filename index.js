import express from "express";
import morgan from "morgan";
// import { router } from "./booksRouter";
import got from "got";
// запрос gg
// const axios = require("axios");
// const querystring = require("querystring");
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8081;
const baseUrl = "http://api.weatherbit.io/v2.0/current";
const key = process.env.WEATHER_API_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(cors());
// app.use("/api", router);

app.get("/api/weather", async (req, res) => {
  try {
    //req.query
    //req.params
    //req.body
    //req.headers
    const { latitude, longitude } = req.query;

    if (!latitude) {
      return res
        .status(400)
        .json({ message: "latitude parameter is mandatory" });
    }

    if (!longitude) {
      return res
        .status(400)
        .json({ massage: "longitude parameter  is mandatory" });
    }
    // console.log("gg233243545", key);
    const response = await got(baseUrl, {
      searchParams: {
        key,
        lat: latitude,
        lon: longitude,
      },
      responseType: "json",
    });
    const [weatherData] = response.body.data;
    const {
      city_name,
      weather: { description },
      temp,
    } = weatherData;
    //   if (!weatherData) {

    //   }
    res.json({ city_name, description, temp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error at server launch:", err);
  }
  console.log(`Мы начали на порту ${PORT}`);
});
