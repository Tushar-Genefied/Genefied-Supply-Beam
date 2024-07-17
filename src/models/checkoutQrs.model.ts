import { dbNames } from "../config/tableName";

type checkoutQrsType = {
    batch_id: number;
    qr_id: number;
    pqr_id?: number;
    cqr_id?: number;
    qr_type: string;
    user_id: number;
    user_name: string;
};

const CheckoutQrs = function (this: checkoutQrsType, checkoutQrsData: checkoutQrsType) {
	this.batch_id = checkoutQrsData.batch_id;
	this.qr_id = checkoutQrsData.qr_id;
	this.pqr_id = checkoutQrsData.pqr_id || 0;
	this.cqr_id = checkoutQrsData.cqr_id || 0;
	this.qr_type = checkoutQrsData.qr_type;
	this.user_id = checkoutQrsData.user_id;
	this.user_name = checkoutQrsData.user_name;
};

CheckoutQrs.create = async (knexConnection: any, newCheckoutQrs: checkoutQrsType, result: any) => {
	try {
		const res = await knexConnection
			.insert(newCheckoutQrs)
			.into(dbNames.checkoutQrs)
			.returning("id");
		result(false, { ...newCheckoutQrs, id: res[0].id });
	} catch (error) {
		console.error("Error at Add CheckoutQrs in model ", error);
		result(true, error);
	}
};

CheckoutQrs.getByQrId = async (knexConnection: any, id: number, result: any) => {
	try {
		const res: any = await knexConnection("supply_beam_checkout_qrs").where({ "qr_id": id });
		result(false, res);
	} catch (error) {
		console.error("Error at Get CheckoutQrs by Id in model ", error);
		result(true, error);
	}
};

export default CheckoutQrs;
