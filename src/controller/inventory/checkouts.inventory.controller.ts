import Checkout from "../../models/checkouts.model";
import QR from "../../models/qr.model";
import SupplyBeamSiteLocations from "../../models/supplyBeamSiteLocations.model";
import { createTracking } from "../../models/tracking.model";
import { getConnectionBySlug } from "../../utils/connectionManager";
import { returnUniqueCode } from "../../utils/helper";
import { sendErrorResponse, sendResponse } from "../../utils/utils";

export const checkoutInventory = async (req: Request | any, res: Response | any) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        console.log("req.body.qrs",req.body);
		if (!req.body || !req.body.qrs || req.body.qrs.length == 0)   {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}

		const { id : userId , location_id, name : userName } =  req.user;
		const userRoleId = req.user.role_id ? req.user.role_id : req.user.user_type_id;
		const locationId=location_id[0];
		const remarks = req.body.remarks;
		const bill = req.body.bill;
		const shipTo = req.body.ship_to;
		const trackingType = 'OUT';


		const parsedUniqueCodeArray =  returnUniqueCode('array', req.body.qrs);
		console.log("parsedUniqueCodeArray",parsedUniqueCodeArray);
		const qrs = await QR.getUniqueCodeAndReturnIds(tenantKnexConnection,parsedUniqueCodeArray);
	
		console.log("qrs : ",qrs);

		const resQrsIds = await QR.getQrIdAndType(tenantKnexConnection ,qrs );

		if( resQrsIds.length == 0){
			return await sendResponse(false, 409, "No Such Qr Code Exists ", null, res);
		}
		let getOutcodeAndOutcodetypeRes=[];

		// out_code is location code / user_id to where this order is going so below is wrong

		// location id != zero then scan is done by supply users , outcode is location_code
		// location id == zero then scan is done by app users , outcode is app_user_id 
		// if( locationId != 0){
			
		// 	getOutcodeAndOutcodetypeRes  =  await SupplyBeamSiteLocations.getOutcodeAndOutcodetype(tenantKnexConnection,Number(locationId));

		// 	if( getOutcodeAndOutcodetypeRes.length == 0 ){
		// 		return await sendResponse(false, 409, "This location does not exist", null, res);
		// 	}
		// }

		const epoch = Date.now();
		const refNo =  "OUT-"+epoch;

        const checkoutData  = {
			location_id : locationId ,
			user_role_id : userRoleId,
			user_id : userId,
			user_name : userName,
			total_count : resQrsIds.length,
			remarks : remarks ? remarks : null,
			ship_to : shipTo ? shipTo : null,
			bill : bill ? bill : null,
			ref :refNo,
			// out_code : locationId != 0 ? getOutcodeAndOutcodetypeRes[0].location_code : userId,
			// out_user_type : locationId != 0 ? getOutcodeAndOutcodetypeRes[0].location_type_id : userRoleId
		}
		console.log("checkoutData",checkoutData);
		return await Checkout.create(tenantKnexConnection,checkoutData,async(checkoutInsertError: Error, checkoutInsertData: any)=>{
			if(checkoutInsertError){
				return await sendErrorResponse(500, "some error occurred ", checkoutInsertData, res);
			}else{
				const extraData = {
					batch_id: checkoutInsertData.id,
					user_id: userId,
					user_name: userName,
					location_id : locationId,
					user_role_id : userRoleId
		        };

				const createTrackingResp =  await createTracking(tenantKnexConnection,trackingType,resQrsIds,extraData);

				if(!createTrackingResp.success){
					await Checkout.deleteCheckout(tenantKnexConnection,checkoutInsertData.id);
					return await sendErrorResponse(500, "some error occurred ", checkoutInsertData, res);
				}

				return await sendResponse(true, 200, "Checkout successfully ", {
					ref : refNo 
				}, res);
			}
		});

	} catch (error) {
		console.error("error at verifying qr in supply beam", error);
		return await sendErrorResponse(500, "Error at verifying QR ", error, res);
	}
};
