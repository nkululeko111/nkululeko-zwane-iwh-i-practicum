const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT = "nkulu_practicum.mythical_creature"; 

// ROUTE 1 — Homepage (List objects)
app.get("/", async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT}`;

    try {
        const resp = await axios.get(url, {
            headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
        });

        const creatures = resp.data.results;

        res.render("homepage", {
            title: "Mythical Creatures | HubSpot Practicum",
            creatures
        });

    } catch (err) {
        console.error(err.response?.data || err);
        res.send("Error loading records.");
    }
});

// ROUTE 2 — Render Form
app.get("/update-cobj", (req, res) => {
    res.render("updates", {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
    });
});

// ROUTE 3 — Create new record
app.post("/update-cobj", async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT}`;

    const body = {
        properties: {
            name: req.body.name,
            power: req.body.power,
            origin: req.body.origin
        }
    };

    try {
        await axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                "Content-Type": "application/json"
            }
        });

        res.redirect("/");

    } catch (err) {
        console.error(err.response?.data || err);
        res.send("Error creating record.");
    }
});

// Server
app.listen(3000, () =>
    console.log("Listening on http://localhost:3000")
);
