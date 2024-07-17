// const environment = process.env.NODE_ENV || "development";
const knexfile = require("./knexfile");
const knex = require("knex");
export const adminMigrationConnection = knex(knexfile.development);

export const tenantMigrationConnection = async (conConfig:any)=>{
	return await knex({
		client: "postgresql",
		connection: conConfig,
		pool: {
			min: 2,
			max: 1000
		},
		migrations: {
			tableName: "knex_migrations",
			directory: __dirname + "/migrations/tenant",
			extension: "ts"
		}
	});
};
