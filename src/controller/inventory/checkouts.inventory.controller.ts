import QR from "../../models/qr.model";
import { getConnectionBySlug } from "../../utils/connectionManager";
import { sendErrorResponse, sendResponse } from "../../utils/utils";

export const checkoutInventory = async (req: Request | any, res: Response | any) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        
		if (!req.body || !req.body.qrs || req.body.qrs.length == 0)   {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}

		const trackingType = '2';
		const qrs = req.body.qrs;
		const { id : userId , } =  req.user;
		
		const resQrsIds = await QR.getQrIdAndType(tenantKnexConnection ,qrs );

		if( resQrsIds.length == 0){
			return await sendResponse(false, 409, "No Such Qr Code Exists ", null, res);
		}
        
		// const extraData = {
		// 	batch_id: number,
        //     user_id: number,
		// 	user_name: string,
		// 	location_id : number,
		// 	user_role_id : number
		// }


	} catch (error) {
		console.error("error at verifying qr in supply beam", error);
		return await sendErrorResponse(500, "Error at verifying QR ", error, res);
	}
};
