import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Task from "./Task.js";

const User = sequelize.define("User", {
    name:  DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: DataTypes.STRING,
}, {
    timestamps: true,
});

User.hasMany(Task, { foreignKey: "userId", as: "tasks" , onDelete: "CASCADE" });

export default User;