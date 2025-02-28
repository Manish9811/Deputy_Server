import connection from "../Config/DbConfig.js";
import { DataTypes } from 'sequelize'


export const AdminRegistration = connection.define("AllLoginUsersSchemas", {
    LoginUserId: { primaryKey: true, type: DataTypes.INTEGER, autoIncrement: true },
    LoginUserName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BusinessName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LoginUserToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LoginUserName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BusinessLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BusinessIndustry: {
        type: DataTypes.STRING,
        allowNull: false
    },
    IsLoginUserAdmin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LoginUserRole: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BusinessEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
})