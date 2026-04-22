const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
});

const convertPlaceholders = (query) => {
    let index = 0;
    return query.replace(/\?/g, () => `$${++index}`);
};

const execQuery = async (sql, params = []) => {
    let pgSql = convertPlaceholders(sql.trim());
    const isInsert = /^INSERT/i.test(pgSql);
    if (isInsert && !/RETURNING/i.test(pgSql)) {
        pgSql = pgSql.replace(/;?\s*$/, '') + ' RETURNING id';
    }
    const result = await pool.query(pgSql, params);
    const rows = result.rows;
    const insertId = isInsert && rows.length > 0 ? rows[0].id : null;
    const meta = {
        affectedRows: result.rowCount,
        insertId,
    };
    return [rows, meta];
};

const compatPool = {
    query: execQuery,
    execute: execQuery,
};

module.exports = compatPool;
