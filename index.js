"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express().use(bodyParser.json());

app.post("/webhook", (req, res) => {
  if (!body.object === "page") return res.sendStatus(404);
  console.log("POST: webhook");
  const body = req.body;
  body.entry.forEach((entry) => {
    //reciben los mensajes
    const webhookEvent = entry.messaging[0];

    console.log(webhookEvent);
  });
  res.status(200).send("EVENTO RECIBIDO");
});
app.get("/webhook", (req, res) => {
  console.log("GET: webhook");
  const VERIFY_TOKEN = "xmlsospwosmsmsj";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token)
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFICADO");
      res.status(202).send(challenge);
    } else {
      res.sendStatus(404);
    }
});

app.listen(3000, () => {
  console.log("Servidor iniciado...");
});
