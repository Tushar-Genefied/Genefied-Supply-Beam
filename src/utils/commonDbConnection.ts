import knex, { Knex } from "knex";
import {serverConfig} from "../config/enviroment";

const knexConfig : Knex.Config = {
	client: "pg",
	connection: {
		user: serverConfig.db_user,
		host: serverConfig.db_host,
		port: Number(serverConfig.db_port?.trim()),
		database: serverConfig.db_database,
		password: serverConfig.db_password
	},
	pool: {
		min: 2,
		max: 1000,
		propagateCreateError: false 
	},
};

export const knexConnection = knex(knexConfig);
