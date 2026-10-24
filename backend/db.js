const { DatabaseSync } = require('node:sqlite');
const migrations = require('./migrations');

// tests set DB_PATH to ':memory:' so they never touch the real database file
const db = new DatabaseSync(process.env.DB_PATH || "lost-and-found.db");

module.exports = {
	runMigrations: function () {
		for (let i = 0; i < migrations.length; ++i)
		{
			db.exec(migrations[i]);
		}
	},
	query: function (text, ...params) {
		return db.prepare(text).all(...params);
	},
	db
}