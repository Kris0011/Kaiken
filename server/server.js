const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./src/config/db");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { initializeSocket } = require("./src/config/socket");
require("dotenv").config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Opinion Trading API',
            version: '1.0.0',
            description: 'A sample API'
        },
    },
    apis: ['./routes/*.js'], // path to files with OpenAPI annotations
};

const swaggerSpec = swaggerJsdoc(options);

const app = express();
const server = http.createServer(app);


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || "https://kaiken.krispatel.me",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
));
app.use(express.json());

(async () => {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🚀 Swagger UI running on http://localhost:${PORT}/api-docs`);
        initializeSocket(server);
    });
})().catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/events", require("./src/routes/eventsRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/trades", require("./src/routes/tradeRoutes"));

app.get("/", (req, res) => {
    res.send("Opinion Trading Backend Running...");
});

module.exports = server;
