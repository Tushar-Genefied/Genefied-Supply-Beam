import { dbNames } from "../config/tableName";

type checkinType = {
    location_id: number;
    user_role_id: number;
    user_id: number;
    user_name: string;
    ref: string;
    total_count: number;
    remarks?: string;
	picklist_no?:string;
    order_no ?: string;
    status : string;
    invoice_no?:string;
};

const Checkin = function (this: checkinType, checkinData: checkinType) {
	this.location_id = checkinData.location_id;
	this.user_role_id = checkinData.user_role_id;
	this.user_id = checkinData.user_id;
	this.user_name = checkinData.user_name;
	this.ref = checkinData.ref;
	this.total_count = checkinData.total_count;
    this.picklist_no=checkinData.picklist_no;
    this.order_no = checkinData.order_no;
    this.invoice_no = checkinData.invoice_no;
	this.remarks = checkinData.remarks;
	this.status = checkinData.status;

};

Checkin.create = async (knexConnection: any, newCheckin: checkinType, result: any) => {
	try {
		const res = await knexConnection
			.insert(newCheckin)
			.into(dbNames.checkIns)
			.returning("id");
		result(false, { ...newCheckin, id: res[0].id });
	} catch (error) {
		console.error("Error at Add Checkin in model ", error);
		result(true, error);
	}
};

export default Checkin;