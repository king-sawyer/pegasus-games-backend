module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://dunder_mifflin@localhost/pegasus_games",
  JWT_SECRET: process.env.JWT_SECRET || "secret-key-jwt",
};
