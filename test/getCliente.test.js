const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const app = express();
const dbPath = path.join(process.cwd(), "bd.json");

app.use(express.json());
app.use(bodyParser.json());

const bd = JSON.parse(readFileSync(dbPath));

app.get('/clientes', (req, res) => {
    res.json(bd.clientes);
});

describe('GET /clientes', () => {
    it('se espera la lista de clientes', async () => {
        const response = await request(app)
            .get('/clientes')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

app.listen(3000);

