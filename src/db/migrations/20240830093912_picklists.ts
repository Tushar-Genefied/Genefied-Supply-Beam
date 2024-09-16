import type { Knex } from "knex";
import { TableNames } from "../../config/tableName";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TableNames.pickLists, (table) => {
		table.increments("id").primary(); 
		table.bigInteger("order_id").notNullable(); 
		table.string("order_no",50).notNullable(); 
		table.string("invoice_no",50).defaultTo(null); 
		table.string("uom",50); 
		table.text("detail_list"); 
        table.integer("location_id").notNullable(); 
		table.integer("user_role_id").notNullable();
		table.integer("user_id").notNullable();
		table.string("user_name", 100).notNullable();
		table.string("pk_ref", 50).notNullable();
		table.string("remarks", 50);
		table.string("status",3).defaultTo("3");
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TableNames.pickListItems);
}

