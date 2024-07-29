import { TableNames } from "../config/tableName";

type checkinQrsType = {
    batch_id: number;
    qr_id: number;
    pqr_id?: number;
    cqr_id?: number;
    qr_type: string;
    user_id: number;
    user_name: string;
};

const CheckInQrs = function (this: checkinQrsType, checkoutQrsData: checkinQrsType) {
	this.batch_id = checkoutQrsData.batch_id;
	this.qr_id = checkoutQrsData.qr_id;
	this.pqr_id = checkoutQrsData.pqr_id || 0;
	this.cqr_id = checkoutQrsData.cqr_id || 0;
	this.qr_type = checkoutQrsData.qr_type;
	this.user_id = checkoutQrsData.user_id;
	this.user_name = checkoutQrsData.user_name;
};



export default CheckInQrs;