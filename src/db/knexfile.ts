import type { Knex } from "knex";

if (process.argv[5] === "prod") {
	require("dotenv").config({
		path: __dirname + "/../.env"
        
	});
	console.info("Mode : ",process.env.MODE);
	
}else if(process.argv[5] == "dev"){
	require("dotenv").config({
		path: __dirname + "/../.env.dev"
        
	});
	console.info("Mode : ",process.env.MODE);
} else {
	require("dotenv").config({
		path: __dirname + "/../.env.test"
	}); 
	console.info("Mode :",process.env.MODE);
}


const config: { [key: string]: Knex.Config } = {
	development: {
		client: "postgresql",
		connection: {
			host:  "65.2.101.243",
			// database: "saas",
			database: "tenant7",
			// user: process.env.DB_USER,
			// password: process.env.DB_PASSWORD,
			user: "postgres",
			password: "Gbpspl@65$9R#8G!"
		},
		pool: {
			min: 2,
			max: 1000
		},
		migrations: {
			tableName: "knex_migrations",
			// directory: __dirname + "/migrations/admin"
			directory: __dirname + "/migrations/tenant"
		}
	},

	production: {
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password"
		},
		pool: {
			min: 2,
			max: 1000
		},
		migrations: {
			tableName: "knex_migrations"
		}
	}

};

module.exports = config;
