import { TableNames } from "../config/tableName";

type picklistsType = {
    order_id: number;
    order_no: string;
    invoice_no: string;
    uom: string;
    detail_list: string;
    location_id: number;
    user_role_id: number;
    user_id: number;
    user_name: string;
    pk_ref: string;
    remarks?: string;

};

const Picklists = function (this: picklistsType, picklistsData: picklistsType) {
	this.order_id = picklistsData.order_id;
	this.order_no = picklistsData.order_no;
	this.invoice_no = picklistsData.invoice_no;
	this.uom = picklistsData.uom;
	this.detail_list = picklistsData.detail_list;
	this.location_id = picklistsData.location_id;
	this.user_role_id = picklistsData.user_role_id;
	this.user_id = picklistsData.user_id;
	this.user_name = picklistsData.user_name;
	this.pk_ref = picklistsData.pk_ref;
	this.remarks = picklistsData.remarks;

};

Picklists.create = async (knexConnection: any, newPicklists: picklistsType, result: any) => {
	try {
		const res = await knexConnection
			.insert(newPicklists)
			.into(TableNames.pickLists)
			.returning("id");
		result(false, { ...newPicklists, id: res[0].id });
	} catch (error) {
		console.error("Error at Add new Picklist in model ", error);
		result(true, error);
	}
};


Picklists.picklistIdCheckInPickLists = async (knexConnection: any, picklistId: number ) => {
	try {
		const res = await knexConnection
			.select("*")
			.from(TableNames.pickLists)
            .where({
                picklist_id : picklistId
            })
		if( res.length > 0){
            return true;
        }
        return false;
	
	} catch (error) {
		console.error("Error at picklist Id already exist check in model ", error);
		return false;
	}
};
Picklists.invoicenoCheckInPickLists = async (knexConnection: any, invoiceNo: number ) => {
	try {
		const res = await knexConnection
			.select("*")
			.from(TableNames.pickLists)
            .where({
                invoice_no : invoiceNo
            })
		if( res.length > 0){
            return res;
        }
        return res;
	
	} catch (error) {
		console.error("Error at invoice no already exist check in model ", error);
		return [];
	}
};

Picklists.getPicklistIDByOrderno = async (knexConnection: any, orderNo: number ) => {
	try {
		const res = await knexConnection
			.select("*")
			.from(TableNames.pickLists)
            .where({
                order_no : orderNo,
				"status" : "3"
            })
		if( res.length > 0){
            return res;
        }
        return [];
	
	} catch (error) {
		console.error("Error at get Picklist Id By Order No in model ", error);
		return [];
	}
};

export default Picklists;