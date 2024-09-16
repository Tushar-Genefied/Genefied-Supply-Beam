import type { Knex } from "knex";
import { TableNames } from "../../config/tableName";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TableNames.pickListItems, (table) => {
		table.increments("id").primary(); 
		table.bigInteger("picklist_id").notNullable(); 
		table.string("product_code").notNullable(); 
		table.integer("qty").notNullable(); 
		table.integer("picked_qty").notNullable(); 
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TableNames.pickListItems);
}

