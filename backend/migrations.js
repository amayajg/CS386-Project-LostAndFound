// This isn't the optimal way of doing things,
// but it works for the time being.

module.exports = [
	`CREATE TABLE IF NOT EXISTS Item (
        Id INTEGER PRIMARY KEY,
        Type TEXT NOT NULL,
        Name TEXT NOT NULL,
        CategoryId TEXT,
        Color TEXT,
        Brand TEXT,
        Description TEXT,
        Date TEXT,
        LocationId TEXT,
        Status TEXT NOT NULL,
        ReportedBy TEXT
	);`,
];
