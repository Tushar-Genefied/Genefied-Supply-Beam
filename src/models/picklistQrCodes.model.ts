import { TableNames } from "../config/tableName";

type pickListQrCodesType = {
    picklist_id: number;
    picklist_item_id: number;
    qr_id: number;

};

const PickListQrCodes = function (this: pickListQrCodesType, pickListQrCodesData: pickListQrCodesType) {
	this.picklist_id = pickListQrCodesData.picklist_id;
	this.picklist_item_id = pickListQrCodesData.picklist_item_id;
	this.qr_id = pickListQrCodesData.qr_id;
};

PickListQrCodes.create = async (knexConnection: any, newpickListQrCodes: any, result: any) => {
	try {
		const res = await knexConnection
			.insert(newpickListQrCodes)
			.into(TableNames.pickListQrCodes)
			.returning("id");
		result(false, { ...newpickListQrCodes, id: res[0].id });
	} catch (error) {
		console.error("Error at Add new Picklist Qrcodes in model ", error);
		result(true, error);
	}
};

PickListQrCodes.deletePickListQrCodes = async (knexConnection: any, id: any ) => {
	try {
		const res = await knexConnection.from(TableNames.pickListQrCodes).del().where({ id });
	} catch (error) {
		console.error("Error at Delete PickList Qrcodes in model ", error);
	}
};

PickListQrCodes.checkForQrALreadyExistInPicklist = async (knexConnection: any, picklistId: number ,  qr_id: number ) => {
	try {
		const res = await knexConnection.select("*").from(TableNames.pickListQrCodes).where({
            picklist_id : picklistId,
            qr_id : qr_id
        })

        if( res.length > 0){
            return true;
        }
        return false;
	} catch (error) {
		console.error("Error at check for already exist PickList Qrcodes in model ", error);
        return true;
	}
};

PickListQrCodes.getQrIdAndType = async (
	knexConnection: any,
	picklistId: number,
  ) => {
	try {
  
	  const res: any = await knexConnection
		.select("qr.id", "qr.qr_type")
		.from(`${TableNames.pickListQrCodes} as pk`).innerJoin("qr","pk.qr_id", "qr.id")
		.where("pk.picklist_id", picklistId);
  
	  return res;
	} catch (error) {
	  console.error("Error at get qr by unique code in model ", error);
	  return [];
	}
	return;
  };
  
  




export default PickListQrCodes;