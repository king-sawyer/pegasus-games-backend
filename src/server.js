const app = require("./app");
const knex = require("knex");

const { PORT, DATABASE_URL } = require("./config");

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
