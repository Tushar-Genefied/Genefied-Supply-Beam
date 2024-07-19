import { TableNames } from "../config/tableName";

type qrLocationType = {
    batch_id: number;
    batch_type: string;
    qr_id: number;
    pqr_id: number;
    cqr_id: number;
    qr_type: string;
    location_id: number;
    user_role_id: number;
    user_id: number;
    user_name: string;
};

const QrLocations = function (this: qrLocationType, qrLocationData: qrLocationType) {
	this.batch_id = qrLocationData.batch_id;
	this.batch_type = qrLocationData.batch_type;
	this.qr_id = qrLocationData.qr_id;
	this.pqr_id = qrLocationData.pqr_id;
	this.cqr_id = qrLocationData.cqr_id;
	this.qr_type = qrLocationData.qr_type;
	this.location_id = qrLocationData.location_id;
	this.user_role_id = qrLocationData.user_role_id;
	this.user_id = qrLocationData.user_id;
	this.user_name = qrLocationData.user_name;
	

};

QrLocations.create = async (knexConnection: any, newQrLocations: qrLocationType, result: any) => {
	try {
		const res = await knexConnection
			.insert(newQrLocations)
			.into(TableNames.qrLocations)
			.returning("id");
		result(false, { ...newQrLocations, id: res[0].id });
	} catch (error) {
		console.error("Error at Add New Qr Locations in model ", error);
		result(true, error);
	}
};

QrLocations.lastLocations = async (knexConnection: any, whereLastLocation : any, result: any) => {
	try {
		const res = await knexConnection.select("*").from(TableNames.qrLocations).where(whereLastLocation).orderBy("created_at","desc").limit(1);

		result(false,res);
	} catch (error) {
		console.error("Error at Last Locations in model ", error);
		result(true, error);
	}
};

export default QrLocations;