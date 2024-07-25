import { TableNames } from "../config/tableName";

type checkoutType = {
    location_id: number;
    user_role_id: number;
    user_id: number;
    user_name: string;
    ref: string;
    total_count: number;
    remarks?: string;
	out_code:string;
    out_user_type : string;
    status : string;
};

const Checkout = function (this: checkoutType, checkoutData: checkoutType) {
	this.location_id = checkoutData.location_id;
	this.user_role_id = checkoutData.user_role_id;
	this.user_id = checkoutData.user_id;
	this.user_name = checkoutData.user_name;
	this.ref = checkoutData.ref;
	this.total_count = checkoutData.total_count;
	this.remarks = checkoutData.remarks;
	this.out_code = checkoutData.out_code;
	this.out_user_type = checkoutData.out_user_type;

};

Checkout.create = async (knexConnection: any, newCheckout: any, result: any) => {
	try {
		const res = await knexConnection
			.insert(newCheckout)
			.into(TableNames.checkouts)
			.returning("id");
		result(false, { ...newCheckout, id: res[0].id });
	} catch (error) {
		console.error("Error at Add Checkout in model ", error);
		result(true, error);
	}
};
Checkout.deleteCheckout = async (knexConnection: any, id: any ) => {
	try {
		const res = await knexConnection.from(TableNames.checkouts).del().where({ id });
	} catch (error) {
		console.error("Error at Add Checkout in model ", error);
	}
};


export default Checkout;