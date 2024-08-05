import { TableNames } from "../config/tableName";

type checkinType = {
    location_id: number;
    user_role_id: number;
    user_id: number;
    user_name: string;
    total_count: number;
    ref: string;
    remarks?: string;

};

const Checkin = function (this: checkinType, checkinData: checkinType) {
	this.location_id = checkinData.location_id;
	this.user_role_id = checkinData.user_role_id;
	this.user_id = checkinData.user_id;
	this.user_name = checkinData.user_name;
	this.ref = checkinData.ref;
	this.total_count = checkinData.total_count;
	this.remarks = checkinData.remarks;

};

Checkin.create = async (knexConnection: any, newCheckin: checkinType, result: any) => {
	try {
		const res = await knexConnection
			.insert(newCheckin)
			.into(TableNames.checkIns)
			.returning("id");
		result(false, { ...newCheckin, id: res[0].id });
	} catch (error) {
		console.error("Error at Add Checkin in model ", error);
		result(true, error);
	}
};

Checkin.deleteCheckin = async (knexConnection: any, id: any ) => {
	try {
		const res = await knexConnection.from(TableNames.checkIns).del().where({ id });
	} catch (error) {
		console.error("Error at Add Checkin in model ", error);
	}
};




export default Checkin;