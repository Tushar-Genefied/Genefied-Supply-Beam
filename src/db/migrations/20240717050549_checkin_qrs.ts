import { Knex } from "knex";
import { dbNames } from "../../config/tableName";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(dbNames.checkInQrs, (table) => {
		table.increments("id").primary(); // Primary key
		table.integer("batch_id").notNullable(); // Checkin Id
		table.integer("qr_id").notNullable(); // QR ID
		table.integer("pqr_id").notNullable().defaultTo(0); // parent qr ID
		table.integer("cqr_id").notNullable().defaultTo(0); // child qr ID
		table.string("qr_type").notNullable().defaultTo(1); // QR Type
		table.integer("user_id").notNullable();
		table.string("user_name", 100).notNullable();
		table.string("picklist_no", 50);
		table.string("order_no", 50);
		table.string("invoice_no", 50);

		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(dbNames.checkInQrs);
}
