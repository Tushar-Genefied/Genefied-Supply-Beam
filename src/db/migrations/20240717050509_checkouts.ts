import { Knex } from "knex";
import { TableNames } from "../../config/tableName";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableNames.checkouts, (table) => {
		table.increments("id").primary(); // Adds an auto-incrementing primary key column
		table.integer("location_id").notNullable().defaultTo(0); // Adds a non-nullable integer column for location ID
		table.integer("user_role_id").notNullable(); // Adds a non-nullable integer column for user role ID
		table.integer("user_id").notNullable();
		table.string("user_name", 100).notNullable();
		table.string("picklist_no", 50);
		table.string("order_no", 50);
		table.string("invoice_no", 50);

		table.string("ref",32).unique().notNullable(); // Adds a non-nullable string column for reference
		table.integer("total_count").notNullable(); // Adds a non-nullable integer column for total count
		table.text("remarks"); // Adds a text column for remarks
		table.string("ship_to"); // Adds a non-nullable string column for ship to address
		table.string("bill");
		table.string("out_code"); // mainly appUserId
        table.string("out_user_type");
		table.string("status",3).defaultTo("1");
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return await knex.schema.dropTable(TableNames.checkouts);
}
