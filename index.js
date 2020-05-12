"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express().use(bodyParser.json());
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.post("/webhook", (req, res) => {
  if (!body.object === "page") return res.sendStatus(404);
  console.log("POST: webhook");
  const body = req.body;
  body.entry.forEach((entry) => {
    //reciben los mensajes
    const webhookEvent = entry.messaging[0];

    console.log(webhookEvent);
    const sender_psid = webhookEvent.sender.id;
    console.log(`Sender PSID: ${sender_psid}`);
    //validar recibir mensaje
    if (webhookEvent.message) {
      handleMessage(sender_psid, webhookEvent.message);
    } else if (webhookEvent.postback) {
      handlePostback(sender_psid, webhookEvent.postback);
    }
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

function handleMessage(sender_psid, received_message) {
  let response;
  if (received_message.text) {
    response = {
      text: `Tu mensaje fue: ${received_message.text}:)`,
    };
  } else if (received_message_message.attachment) {
    const url = received_message.attachment[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Welcome!",
              image_url: "https://petersfancybrownhats.com/company_image.png",
              subtitle: "We have the right hat for everyone.",

              buttons: [
                {
                  type: "web_url",
                  url: "https://petersfancybrownhats.com",
                  title: "View Website",
                },
                {
                  type: "postback",
                  title: "Start Chatting",
                  payload: "DEVELOPER_DEFINED_PAYLOAD",
                },
              ],
            },
          ],
        },
      },
    };
  }
  callSendApi(sender_psid, response);
}
function handlePostback(sender_psid, received_postback) {
  let response = ``;
  const payload = received_postback.payload;
  if (payload === "yes") {
    response = { text: "Gracias por las fotos" };
  } else if (payload === "no") {
    response = { text: "Entonces manda una foto" };
  }
  callSendApi(sender_psid, response);
}
function callSendApi(sender_psid, response) {
  const requestBody = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
  request(
    {
      uri: "",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: requestBody,
    },
    (err, res, body) => {
      if (err) return console.error(" no es posible enviar");
    }
  );
}

app.listen(process.env.PORT || 5000, () => {
  console.log("Servidor iniciado...");
});
