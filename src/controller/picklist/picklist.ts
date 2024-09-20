import Checkout from "../../models/checkouts.model";
import Orders from "../../models/orders.model";
import Picklists from "../../models/picklist.model";
import PicklistsItems from "../../models/picklistItems.model";
import QrLocations from "../../models/qrLocations.model";
import SupplyBeamSiteLocations from "../../models/supplyBeamSiteLocations.model";
import { getConnectionBySlug } from "../../utils/connectionManager";
import { qrStatusObject } from "../../utils/helper";
import { sendErrorResponse, sendResponse } from "../../utils/utils";

export const getPicklistItemsDetails = async (req: Request | any, res: Response | any) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        
		if (!req.body || !req.body.order_no)  {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}
		
        const orderNo = req.body.order_no;

        // validate Order no and get order details
        const orderDetails = await Orders.getOrderDetailsByOrderNO(tenantKnexConnection,orderNo);
        

        if( orderDetails.length == 0 ){
            return await sendResponse(false, 404, "Wrong  Order Details ", null, res);
    
        }

        // get INPROGRESS Pick list Id by Order NO 
        const pickListDetails = await Picklists.getPicklistIDByOrderno(tenantKnexConnection,orderNo);
        

        if( pickListDetails.length == 0 ){
            return await sendResponse(false, 409, "No Active PickList", null, res);
    
        }

        // get Pick list Items By Picklist Id 
        const pickListItemsDetails = await PicklistsItems.getPickItemsByPickListId(tenantKnexConnection,pickListDetails[0].id);
        

        if( pickListItemsDetails.length == 0 ){
            return await sendResponse(false, 409, "Could not Find picklist Items", null, res);
    
        }

        const items = pickListItemsDetails.map((item : any)=>{
            let array = [];
            
            for (let [key, value] of Object.entries(item)) {
                array.push(value);
            }
            
            return array;
        });

        const data = { ...orderDetails[0]  , items : items};

        return await sendResponse(true, 200, "Successfully fetch Picklist Data", data, res);

	} catch (error) {
		console.error("error at get Picklist Items Details in Picklist", error);
		return await sendErrorResponse(500, "Error at get picklist items ", error, res);
	}
};
