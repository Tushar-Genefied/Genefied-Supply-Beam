import { Knex } from "knex";
import { dbNames } from "../../config/tableName";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(dbNames.checkoutQrs, (table) => {
		table.increments("id").primary(); // Primary key
		table.integer("batch_id").notNullable(); // Checkout ID
		table.integer("qr_id").notNullable(); // QR ID
		table.integer("pqr_id").notNullable().defaultTo(0); // parent qr ID
		table.integer("cqr_id").notNullable().defaultTo(0); // child qr ID
		table.string("qr_type").notNullable().defaultTo(1); // QR Type
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.integer("created_by_id").notNullable();
		table.string("created_by_name", 255).notNullable();
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.integer("updated_by_id");
		table.string("updated_by_name", 255);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(dbNames.checkoutQrs);
}
