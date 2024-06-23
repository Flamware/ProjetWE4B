const { Client } = require("pg");
const fs = require("fs");
const readline = require("readline");
const dbUrl = "postgresql://axel:CqfYxdcHoA1lZeT2DAz5fA@punchy-dragon-11093.8nj.gcp-europe-west1.cockroachlabs.cloud:26257/we4b_db?sslmode=verify-full";

const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    }
  });
  
  async function connectDatabase() {
    console.log("Connexion à la base de données avec l'URL:", dbUrl);
  
    try {
      await client.connect();
      console.log("Connecté à la base de données");
    } catch (error) {
      console.error("Erreur de connexion à la base de données:", error);
      throw error;
    }
  }
  
  module.exports = { connectDatabase, client };
