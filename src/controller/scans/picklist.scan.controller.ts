import Orders from "../../models/orders.model";
import Picklists from "../../models/picklist.model";
import PicklistsItems from "../../models/picklistItems.model";
import PickListQrCodes from "../../models/picklistQrCodes.model";
import { getConnectionBySlug } from "../../utils/connectionManager";
import { qrStatusObject } from "../../utils/helper";
import { sendErrorResponse, sendResponse } from "../../utils/utils";

export const verifyQrCodeForPickList = async (req: Request | any, res: Response | any) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        
		if (!req.body || !req.body.unique_code || !req.body.qr_details || !req.body.picklist_id || !req.body.picklist_item_id)  {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}
        const picklistId = req.body.picklist_id;
		const uniqueCode = req.body.unique_code.trim();
        const qrDetails = req.body.qr_details;
        const qrType   = req.body.qr_details.qr_type.toString();
        const {id : userId , name : userName , location_id  } = req.user;
        const currentLocationId = location_id[0];
        let whereLastLocation :any = {};

        whereLastLocation[qrStatusObject[qrType]]=qrDetails.qr_type;
        let check :any;



        // picklist_id check in picklist table
        

        check = await Picklists.picklistIdCheckInPickLists(tenantKnexConnection,picklistId);
        

        if( !check){
            
            return await sendResponse(false, 404, "This PickList Does not exist ", qrDetails, res);
    
        }

        // check for product code in orders items table

        // check for product code in picklist items table
        check = await PicklistsItems.checkForProductNoInPickListItems(tenantKnexConnection,picklistId , qrDetails.product_code);
        

        if( !check){
            
            return await sendResponse(false, 404, "This Item is not present in picklist ", qrDetails, res);
    
        }

        // check for qr_id already exist in the picklist qr codes list
        check =await PickListQrCodes.checkForQrALreadyExistInPicklist(tenantKnexConnection,picklistId , qrDetails.id);

        if( check){
            
        return await sendResponse(false, 404, "Already exist in the picklist ", qrDetails, res);

        }

        return await sendResponse(true, 200, "Qr is verified", qrDetails, res);

	} catch (error) {
		console.error("error at verifying qr in supply beam", error);
		return await sendErrorResponse(500, "Error at verifying QR ", error, res);
	}
};