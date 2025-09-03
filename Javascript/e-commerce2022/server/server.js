require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const path = require('path');

const app = express();
const port = 8080;

// Reemplaza esto con tus credenciales de prueba
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

app.post("/create_preference", (req, res) => {
    const items = req.body.items.map(item => ({
        title: item.title,
        unit_price: item.unit_price,
        quantity: item.quantity,
    }));

    const preference = {
        items: items,
        back_urls: {
            success: "http://localhost:8080/feedback",
            failure: "http://localhost:8080/feedback",
            pending: "http://localhost:8080/feedback"
        },
        auto_return: "approved"
    };

    // Log para depuración
    console.log('Preference enviada a Mercado Pago:', JSON.stringify(preference, null, 2));

    mercadopago.preferences.create(preference)
    .then(function(response){
        res.json({ id: response.body.id });
    })
    .catch(function(error){
        console.log(error);
        res.status(500).json({ error: "Error al crear la preferencia" });
    });
});

app.get('/feedback', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
