import { TableNames } from "../config/tableName";

type picklistsItemsType = {
    picklist_id: number;
    product_code: string;
    qty: number;
    picked_qty: number;

};

const PicklistsItems = function (this: picklistsItemsType, picklistsItemsData: picklistsItemsType) {
	this.picklist_id = picklistsItemsData.picklist_id;
	this.product_code = picklistsItemsData.product_code;
	this.qty = picklistsItemsData.qty;
	this.picked_qty = picklistsItemsData.picked_qty;

};

PicklistsItems.create = async (knexConnection: any, newPicklistsItems: any, result: any) => {
	try {
		const res = await knexConnection
			.insert(newPicklistsItems)
			.into(TableNames.pickListItems)
			.returning("id");
		result(false, { ...newPicklistsItems, id: res[0].id });
	} catch (error) {
		console.error("Error at Add new Picklists Items in model ", error);
		result(true, error);
	}
};


PicklistsItems.checkForProductNoInPickListItems = async (knexConnection: any, picklistId: number ,  productCode: string ) => {
	try {
		const res = await knexConnection.select("*").from(TableNames.pickListItems).where({
            picklist_id : picklistId,
            product_code : productCode
        })

        if( res.length > 0){
            return true;
        }
        return false;
	} catch (error) {
		console.error("Error at check for already exist PickList Qrcodes in model ", error);
        return false;
	}
};

PicklistsItems.getPickItemsByPickListId = async (knexConnection: any, picklistId: number ) => {
	try {
		const res = await knexConnection.select("product_code","qty","picked_qty").from(TableNames.pickListItems).where({
            picklist_id : picklistId,
        })

        if( res.length > 0){
            return res;
        }
        return res;
	} catch (error) {
		console.error("Error at check for already exist PickList Qrcodes in model ", error);
        return [];
	}
};




export default PicklistsItems;