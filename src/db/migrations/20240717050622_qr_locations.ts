import { Knex } from "knex";
import { TableNames } from "../../config/tableName";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableNames.qrLocations, (table) => {
		table.increments("id").primary(); // Primary key
		table.integer("batch_id").notNullable(); // Checkin Id/Checkout Id
        table.string("batch_type").notNullable(); // Checkin Id/Checkout Id
		table.integer("qr_id").notNullable().defaultTo(0);
		table.integer("pqr_id").notNullable().defaultTo(0);
		table.integer("cqr_id").notNullable().defaultTo(0);
		table.string("qr_type").notNullable().defaultTo(1); // QR Type
        table.integer("location_id").notNullable().defaultTo(0); // Adds a non-nullable integer column for location ID
		table.integer("user_role_id").notNullable(); // Adds a non-nullable integer column for user role ID
		table.integer("user_id").notNullable();
		table.string("user_name", 100).notNullable();
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());

	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TableNames.qrLocations);
}
