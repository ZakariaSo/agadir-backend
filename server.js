import express from 'express';
import sequelize from './src/config/database.js';
import "./src/models/User.js";
import "./src/models/Task.js";


const app = express();
app.use(express.json());

const PORT =  4000;

sequelize
    .sync({ alter: true })
    .then(() => console.log("Database connected and synchronized"))
    .catch((err) => console.error("Unable to connect to the database:", err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
