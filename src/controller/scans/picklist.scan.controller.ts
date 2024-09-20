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

        if( !req.body || !req.body.is_validate  ){
            return await sendResponse(false, 400, "Bad Request", null, res);
        }
        console.log("req.body",req.body);
        const isValidate = req.body.is_validate;
        const qrDetails = req.body.qr_details;

        // isValidate is true means qr validation in picklist need to be done at server
        // isValidate is false means qr validation will be done at frontend
        if( isValidate == "false"){
            return await sendResponse(true, 200, "Qr is verified", qrDetails, res);
        }

        
		if (!req.body || !req.body.unique_code || !req.body.qr_details || !req.body.picklist_id )  {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}
        const picklistId = req.body.picklist_id;
		const uniqueCode = req.body.unique_code.trim();
        const qrType   = req.body.qr_details.qr_type.toString();
        const {id : userId , name : userName , location_id  } = req.user;
        const currentLocationId = location_id[0];
        let whereLastLocation :any = {};

        whereLastLocation[qrStatusObject[qrType]]=qrDetails.qr_type;
        let check :any;



        // picklist_id check in picklist table
        

        check = await Picklists.picklistIdCheckInPickLists(tenantKnexConnection,picklistId);
        

        if( !check){
            
            return await sendResponse(false, 404, "This PickList Does not exist ", null, res);
    
        }

        // check for product code in orders items table

        // check for product code in picklist items table
        check = await PicklistsItems.checkForProductNoInPickListItems(tenantKnexConnection,picklistId , qrDetails.product_code);
        

        if( !check){
            
            return await sendResponse(false, 404, "This Item is not present in picklist ", null, res);
    
        }

        // check for qr_id already exist in the picklist qr codes list
        check =await PickListQrCodes.checkForQrALreadyExistInPicklist(tenantKnexConnection,picklistId , qrDetails.id);

        if( check){
            
        return await sendResponse(false, 404, "Already exist in the picklist ", null, res);

        }

        return await sendResponse(true, 200, "Qr is verified", qrDetails, res);

	} catch (error) {
		console.error("error at verifying qr in supply beam", error);
		return await sendErrorResponse(500, "Error at verifying QR ", error, res);
	}
};