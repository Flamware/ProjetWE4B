const { Client } = require("pg");
const fs = require("fs");
const readline = require("readline");
const dbUrl = "postgresql://axel:CqfYxdcHoA1lZeT2DAz5fA@punchy-dragon-11093.8nj.gcp-europe-west1.cockroachlabs.cloud:26257/we4b_db?sslmode=verify-full";

const client = new Client({
    connectionString : dbUrl,
    ssl: {
        rejectUnauthorized: false,
    }
});

require('dotenv').config();
async function connectDatabase() {
    console.log("Connecting to the database with URL:", dbUrl);

    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

exports.connectDatabase = connectDatabase;
exports.client = client;
