import { Knex } from "knex";
import { dbNames } from "../../config/tableName";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(dbNames.checkIns, (table) => {
		table.increments("id").primary(); // Adds an auto-incrementing primary key column
		table.integer("location_id").notNullable(); // Adds a non-nullable integer column for location ID
		table.integer("user_role_id").notNullable(); // Adds a non-nullable integer column for user role ID
		table.string("ref").notNullable(); // Adds a non-nullable string column for reference
		table.integer("total_count").notNullable(); // Adds a non-nullable integer column for total count
		table.text("remarks"); // Adds a text column for remarks
		table.string("status",10).defaultTo("1");
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.integer("created_by_id").notNullable();
		table.string("created_by_name", 255).notNullable();
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.integer("updated_by_id");
		table.string("updated_by_name", 255);
	});
}

export async function down(knex: Knex): Promise<void> {
	return await knex.schema.dropTable(dbNames.checkIns);
}
