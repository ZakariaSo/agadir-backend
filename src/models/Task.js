import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define("Task", {
    userId: DataTypes.INTEGER,
    title:  DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM("pending", "done"),
        defaultValue: "pending",
    },
}, {
    timestamps: true,
});
export default Task;