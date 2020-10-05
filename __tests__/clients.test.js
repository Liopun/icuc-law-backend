const request = require("supertest");
const db      = require("../utils/db"),
      app     = require("../app");
const Auth    = require("../models/auth-model"),
      Clients = require("../models/clients-model");

beforeAll(async () => {
    try {
        await Auth.deleteMany();
        return db.connectDevDB();
    } catch (err) {
        console.log(`You did something wrong! ${err} `);
    }
});

afterAll(() => {
    try {
        return db.disconnectDB();
    } catch (err) {
        console.log(`You did something wrong! ${err} `);
    }
});

describe("POST /api/auth/register", () => {
    test("OK: registering a new admin", async () => {
        const user = await request(app).post('/api/auth/register')
                            .send({
                                name: "Test User",
                                email: "testuser@gmail.com",
                                password: "test123"
                            });
                            
        expect(user.status).toBe(200);
    });
});

describe("POST /api/auth/login", () => {
    test("OK: Logging in admin", async () => {
        const user = await request(app).post('/api/auth/login')
                            .send({
                                email: "testuser@gmail.com",
                                password: "test123"
                            });
        process.env.jwtToken = user.headers['set-cookie'];
        expect(user.status).toBe(200);
        expect(user.body.success).toBeTruthy();
        expect(user.body.message).toBeTruthy();
    });
});


describe("GET /api/auth/refresh-token", () => {
    test("OK: refreshing your token", async (done) => {
        const token = await request(app).get('/api/auth/refresh-token')
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken);

        process.env.jwtToken = token.headers['set-cookie'];
        expect(token.status).toBe(200);
        done();
    });
});

/** Main Features */
describe("POST /api/clients/", () => {
    test("OK: adding a new client", async () => {
        const client = await request(app).post('/api/clients/')
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken)
                                .send({
                                    firstname: "McQueen",
                                    lastname: "Anthony",
                                    address: "1666 Simcoe St S, ON Canada",
                                    lawyer: "Jolly Doe",
                                    tel: "+19059228972"
                                });

        process.env.clientID = client.body._id;
        expect(client.status).toBe(200);
        expect(client.body._id).toBeTruthy();
    });
});

describe("GET /api/clients/", () => {
    test("OK: retrieving all clients", async () => {
        const clients = await request(app).get('/api/clients/')
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken);

        expect(clients.status).toBe(200);
        expect(clients.res.text).toBeTruthy();
    });
});

describe("GET /api/clients/:id", () => {
    test("OK: retrieving a single client", async () => {
        const client = await request(app).get(`/api/clients/${process.env.clientID}`)
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken);

        expect(client.status).toBe(200);
        expect(client.res.text).toBeTruthy();
    });
});

describe("PUT /api/clients/", () => {
    test("OK: updating a client", async () => {
        const client = await request(app).put(`/api/clients/${process.env.clientID}`)
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken)
                                .send({
                                    firstname: "McQueen",
                                    lastname: "Antoinette",
                                    address: "3000 Niagara St S, QC Canada",
                                    lawyer: "Jolly Doe",
                                    tel: "+1(905) 922 - 8972"
                                });

        expect(client.status).toBe(200);
        expect(client.body._id).toBeTruthy();
    });
});

describe("POST /api/clients/notes/:id", () => {
    test("OK: adding a note to a client", async () => {
        const client = await request(app).post(`/api/clients/notes/${process.env.clientID}`)
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken)
                                .send({
                                    description: "This person's lawyer needs to schedule a meeting with by the end of this week."
                                });

        expect(client.status).toBe(200);
        expect(client.body).toBeTruthy();
    });
});

describe("DELETE /api/clients/:id", () => {
    test("OK: deleting a client", async () => {
        const client = await request(app).delete(`/api/clients/${process.env.clientID}`)
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken);

        expect(client.status).toBe(200);
        expect(client.body.msg).toBeTruthy();
    });
});
/** End of Main Features */

describe("GET /api/auth/revoke-token", () => {
    test("OK: revoking your token", async (done) => {
        const token = await request(app).get('/api/auth/revoke-token')
                                .set('Accept', 'application/json')
                                .set('Cookie', process.env.jwtToken);

        process.env.jwtToken = '';
        expect(token.status).toBe(204);
        done();
    });
});