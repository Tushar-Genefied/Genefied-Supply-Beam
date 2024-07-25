import Checkout from "../../models/checkouts.model";
import QR from "../../models/qr.model";
import SupplyBeamSiteLocations from "../../models/supplyBeamSiteLocations.model";
import { createTracking } from "../../models/tracking.model";
import { getConnectionBySlug } from "../../utils/connectionManager";
import { sendErrorResponse, sendResponse } from "../../utils/utils";

export const checkoutInventory = async (req: Request | any, res: Response | any) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        
		if (!req.body || !req.body.qrs || req.body.qrs.length == 0)   {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}

		const { id : userId , location_id : locationId , user_role_id : userRoleId , name : userName } =  req.user;
		const remarks = req.body.remarks;
		const bill = req.body.bill;
		const shipTo = req.body.ship_to;
		const trackingType = '2';
		const qrs = req.body.qrs;
		
		const resQrsIds = await QR.getQrIdAndType(tenantKnexConnection ,qrs );

		if( resQrsIds.length == 0){
			return await sendResponse(false, 409, "No Such Qr Code Exists ", null, res);
		}
		let getOutcodeAndOutcodetypeRes=[];
		if( locationId != 0){
			
			getOutcodeAndOutcodetypeRes  =  await SupplyBeamSiteLocations.getOutcodeAndOutcodetype(tenantKnexConnection,Number(locationId));

			if( getOutcodeAndOutcodetypeRes.length == 0 ){
				return await sendResponse(false, 409, "This ", null, res);
			}
		}

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
			bill_to : bill ? bill : null,
			ref :refNo,
			out_code : locationId != 0 ? getOutcodeAndOutcodetypeRes[0].location_code : userId,
			out_user_type : locationId != 0 ? getOutcodeAndOutcodetypeRes[0].location_type_id : userRoleId
		}

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
					Checkout.deleteCheckout(tenantKnexConnection,checkoutInsertData.id);
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
