import type { Knex } from "knex";
import { TableNames } from "../../config/tableName";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TableNames.orders, (table) => {
		table.increments("id").primary(); 
		table.string("order_no",50).notNullable().unique(); 
		table.string("uom",50).notNullable(); 
		table.string("remarks", 50);
		table.string("status",3).defaultTo("1");
        table.integer("qty").notNullable(); 
        table.integer("no_of_items").notNullable(); 
		table.string("invoice_no",50).defaultTo(null); 
		table.string("customer_code",50).notNullable();
        table.string("source",50).notNullable();  
		table.string("location_code",50).notNullable(); 
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
	});
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TableNames.orders);

}

