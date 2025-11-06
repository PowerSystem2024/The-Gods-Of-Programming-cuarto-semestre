

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// Configuración del cliente de MercadoPago (SDK v2)
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN // Usa tu access token en .env
});
const preference = new Preference(client);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

// Endpoint para recibir feedback de Mercado Pago
app.get('/feedback', (req, res) => {
    // Puedes personalizar la respuesta según el estado del pago
    const { payment_id, status, merchant_order_id } = req.query;
    res.send(`
        <html>
            <head><title>Estado del pago</title></head>
            <body style="font-family:sans-serif;text-align:center;margin-top:50px;">
                <h1>¡Gracias por tu compra!</h1>
                <p><b>Estado:</b> ${status || 'desconocido'}</p>
                <p><b>ID de pago:</b> ${payment_id || 'N/A'}</p>
                <p><b>Orden:</b> ${merchant_order_id || 'N/A'}</p>
                <a href="https://powersystem2024.github.io/The-Gods-Of-Programming-cuarto-semestre/Javascript/e-commerce2022/client/">Volver a la tienda</a>
            </body>
        </html>
    `);
});

app.post('/create_preference', async (req, res) => {
    try {
        // Permite recibir tanto un array de items como un solo producto
        let items = req.body.items;
        if (!items) {
            // Si no hay array, crea uno con los datos recibidos (compatibilidad)
            const { title, quantity, price } = req.body;
            items = [{
                title: title || 'Producto',
                quantity: Number(quantity) || 1,
                currency_id: 'ARS',
                unit_price: Number(price) || 1
            }];
        } else {
            // Si hay array, mapea al formato correcto
            items = items.map(item => ({
                title: item.title,
                quantity: Number(item.quantity),
                currency_id: 'ARS',
                unit_price: Number(item.unit_price || item.price)
            }));
        }

        const body = {
            items,
                    back_urls: {
                        success: 'https://powersystem2024.github.io/The-Gods-Of-Programming-cuarto-semestre/Javascript/e-commerce2022/client/',
                        failure: 'https://powersystem2024.github.io/The-Gods-Of-Programming-cuarto-semestre/Javascript/e-commerce2022/client/',
                        pending: 'https://powersystem2024.github.io/The-Gods-Of-Programming-cuarto-semestre/Javascript/e-commerce2022/client/'
                    },
            auto_return: 'approved',
        };

        console.log('Preference enviada a Mercado Pago:', JSON.stringify(body, null, 2));
        const result = await preference.create({ body });
        if (!result || !result.id) {
            throw new Error('La respuesta de Mercado Pago no contiene un ID');
        }
        res.json({ id: result.id });
    } catch (error) {
        console.error('Error creando preferencia:', error.message);
        res.status(500).json({ error: 'No se pudo crear la preferencia', details: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
