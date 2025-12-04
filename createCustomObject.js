const axios = require("axios");
require("dotenv").config();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

async function createCustomObject() {
  const url = "https://api.hubapi.com/crm/v3/schemas";

  const body = {
    name: "mythical_creature",
    labels: {
      singular: "Mythical Creature",
      plural: "Mythical Creatures"
    },
    fullyQualifiedName: "nkulu_practicum.mythical_creature",
    primaryDisplayProperty: "name",
    requiredProperties: ["name"],

    properties: [
      {
        name: "name",
        label: "Name",
        type: "string",
        fieldType: "text"
      },
      {
        name: "power",
        label: "Power",
        type: "string",
        fieldType: "text"
      },
      {
        name: "origin",
        label: "Origin",
        type: "string",
        fieldType: "text"
      }
    ],

    associations: [
      {
        fromObjectTypeId: "nkulu_practicum.mythical_creature",
        toObjectTypeId: "0-1",
        name: "mythical_creature_to_contact",
        cardinality: "ONE_TO_MANY"
      }
    ]
  };

  try {
    const resp = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Custom object CREATED:");
    console.log(resp.data);
  } catch (err) {
    console.error(err.response?.data || err);
  }
}

createCustomObject();
