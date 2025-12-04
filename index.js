const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT = "2-195458406";

// ROUTE 1 — Homepage (List objects)
app.get("/", async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT}?archived=false&properties=name,power,origin`;

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


// GET /update-cobj — Add query param for edit
app.get("/update-cobj", async (req, res) => {
    const creatureId = req.query.id;
    let creatureData = {};

    if (creatureId) {
        // Fetch existing data from HubSpot
        const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT}/${creatureId}`;
        try {
            const resp = await axios.get(url, {
                headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
            });
            creatureData = resp.data.properties;
        } catch (err) {
            console.error(err.response?.data || err);
        }
    }

    res.render("updates", {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
        creature: creatureData,
        id: creatureId
    });
});


// ROUTE 3 — Create new record
app.post("/update-cobj", async (req, res) => {
    const { id, name, power, origin } = req.body;
    const url = id 
        ? `https://api.hubapi.com/crm/v3/objects/${OBJECT}/${id}`  
        : `https://api.hubapi.com/crm/v3/objects/${OBJECT}`;      

    const body = {
        properties: { name, power, origin }
    };

    try {
        if(id){
            await axios.patch(url, body, {
                headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}`, "Content-Type": "application/json" }
            });
        } else {
            await axios.post(url, body, {
                headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}`, "Content-Type": "application/json" }
            });
        }
        res.redirect("/");
    } catch (err) {
        console.error(err.response?.data || err);
        res.send("Error creating/updating record.");
    }
});

// Server
app.listen(3000, () =>
    console.log("Listening on http://localhost:3000")
);
