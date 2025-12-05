import express from 'express';
import sequelize from './src/config/database.js';
import "./src/models/User.js";
import "./src/models/Task.js";
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';


const app = express();
app.use(express.json());

const PORT =  4000;

app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes);


sequelize
    .sync({ alter: true })
    .then(() => console.log("Database connected and synchronized"))
    .catch((err) => console.error("Unable to connect to the database:", err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
