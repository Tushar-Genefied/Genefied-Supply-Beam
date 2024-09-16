import type { Knex } from "knex";
import { TableNames } from "../../config/tableName";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TableNames.pickListQrCodes, (table) => {
		table.increments("id").primary(); 
		table.bigInteger("picklist_id").notNullable(); 
		table.bigInteger("picklist_item_id").notNullable(); 
		table.bigInteger("qr_id").notNullable(); 
		table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
	});
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TableNames.pickListQrCodes);
}

