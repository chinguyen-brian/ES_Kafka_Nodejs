const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.APP_PORT || 9000;
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});