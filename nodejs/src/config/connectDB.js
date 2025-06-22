const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("thaiduong", "root", null, {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  timezone: "+07:00",
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

// 🔧 EXPORT DEFAULT FUNCTION
module.exports = connectDB;
