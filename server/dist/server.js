'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = require("./routes/auth.routes");
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', auth_routes_1.authRouter);
app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}...`);
});
