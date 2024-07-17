import  knex from "knex";

import {knexConnection} from "./commonDbConnection";
import { serverConfig } from "../config/enviroment";

let connectionMap : any ;


/**
 * The function connects to multiple databases based on the tenants listed in a table.
 * @returns The function `connectAllDb` does not have an explicit return statement, but it returns
 * `undefined` by default.
 */
export async function connectAllDb() {
	let tenants;
	
	try {
		// console.log("knexConnection at connectallsb",knexConnection);
		tenants = await knexConnection.select("*").from("tenants");
		// console.log("tenant",tenants);
	} catch (error) {
		console.error("error at connectAllDb", error);
		return;
	}

	connectionMap = tenants
		.map((tenant : any) => {
			if( serverConfig.mode == "TEST"){
				tenant.db_host = serverConfig.db_host;
			}
			return {
				[tenant.tenant_id]: knex(createConnectionConfig(tenant)),
			};
		})
		.reduce((prev : any, next : any) => {
			return Object.assign({}, prev, next);
		}, {});

	console.log("All DB connected !!!");
}


/**
 * The function creates a connection configuration object for a database based on a given tenant's
 * information.
 * @param {any} tenant - The `tenant` parameter is an object that contains information about a specific
 * tenant, such as their database host, port, username, password, and database name. This function
 * creates a connection configuration object that can be used to connect to the tenant's database using
 * the specified client.
 * @returns A configuration object for creating a database connection, which includes the client,
 * connection details (host, port, user, database, password), and pool settings (minimum and maximum
 * connections). The configuration is specific to a given tenant, as it uses the tenant's database
 * details.
 */
function createConnectionConfig(tenant : any) {
	return {
		client: process.env.DB_CLIENT,
		connection: {
			host: tenant.db_host,
			port: tenant.db_port,
			user: tenant.db_username,
			database: tenant.db_name,
			password: tenant.db_password,
		},
		pool: {
			min: 2,
			max: 1000,
		},
	};
}

/**
 * This function returns a connection object based on a given slug.
 * @param {string} slug - The `slug` parameter is a string that represents a unique identifier for a
 * connection. It is used to retrieve a specific connection from a `connectionMap` object.
 * @returns The function `getConnectionBySlug` is returning the value of `connectionMap[slug]` if
 * `connectionMap` is truthy (not null, undefined, false, 0, NaN, or an empty string), otherwise it
 * returns undefined.
 */
export function getConnectionBySlug(slug : string) {
	// // console.log("connectionMap2", connectionMap);
	if (connectionMap) {
		return connectionMap[slug];
	}
}

