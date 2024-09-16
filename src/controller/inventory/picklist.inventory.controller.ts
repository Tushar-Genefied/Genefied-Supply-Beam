import { TableNames } from "../../config/tableName";
import Orders from "../../models/orders.model";
import Picklists from "../../models/picklist.model";
import QR from "../../models/qr.model";
import { getConnectionBySlug } from "../../utils/connectionManager";
import { sendErrorResponse, sendResponse } from "../../utils/utils";

export const picklistInventory = async (req: Request | any, res: Response | any) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        
		if (!req.body || !req.body.qrs  || req.body.order_id || !req.body.picklist_id || !req.body.detail_list || req.body.detail_list.length == 0 )   {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}

        const picklistId = req.body.picklist_id;
        const orderId = req.body.order_id;
        const detailList = req.body.detail_list;

		const { id : userId , location_id  , name : userName } =  req.user;

		const userRoleId = req.user.role_id ? req.user.rolex_id : req.user.user_type_id;
		const locationId = location_id[0];
		const remarks = req.body.remarks;
		const qrs = req.body.qrs;


        const lastProductCodeDetailsCount :any = {};

        // counting the qr qty agaist product_code to update picklist item table qty
        for( let i = 0 ; i < detailList.length ; i++ ) {
            lastProductCodeDetailsCount[detailList[i].type] ++; 
        }

        let check : any;

        // check for order_id in order table

           check = await Orders.checkOrderIDAlreadyPresent(tenantKnexConnection,orderId);
        

           if( !check){
               
               return await sendResponse(false, 404, "This PickList Does not exist ", null, res);
       
           }
        
        // check for picklist_id in picklist table
        check = await Picklists.picklistIdCheckInPickLists(tenantKnexConnection,picklistId);
        

        if( !check){
            return await sendResponse(false, 404, "This PickList Does not exist ", null, res);
    
        }

        // fetch qrs list
		
		const resQrsIds = await QR.getQrIdAndProductCode(tenantKnexConnection ,qrs );

		if( resQrsIds.length == 0){
			return await sendResponse(false, 409, "No Such Qr Code Exists ", null, res);
		}

        const pickListItemsIdsResp: { picklist_item_id: number; product_code: string }[] = await tenantKnexConnection
        .select("id as picklist_item_id", "product_code")
        .from("picklist_items")
        .where("picklist_id", picklistId);
      
      if (pickListItemsIdsResp.length === 0) {
        return await sendErrorResponse(500, "Something went wrong", {}, res);
      }
      
      const pickListItemsIds: Record<string, number> = {};
      
      for (const item of pickListItemsIdsResp) {
        pickListItemsIds[item.product_code] = item.picklist_item_id;
      }

        const pickListQrCodes :any= [];
   

        for( let i =0 ; i < resQrsIds.length ; i++ ){
            const x = resQrsIds[i];
            
            const qr = {
                qr_id : x.id,
                picklist_id : picklistId,
                picklist_item_id : pickListItemsIds[x.product_code]
            }
            pickListQrCodes.push(qr );
        }

       
		
		const epoch = Date.now();
		const refNo =  "PICK-"+epoch;

        await tenantKnexConnection.transaction(async (trx : any ) => {
            const insertIntoPickListQrCodes = await trx(TableNames.pickListQrCodes).insert(pickListQrCodes);

           

            for (const key in lastProductCodeDetailsCount) {
                if (lastProductCodeDetailsCount.hasOwnProperty(key)) {
                  
                    await trx(TableNames.pickListItems).update({
                        picked_qty : lastProductCodeDetailsCount[key]
                    }).where({
                        picklist_id :  picklistId,
                        product_code : key
                    })
                }
              }

            await trx(TableNames.pickLists).update({
                detail_list : (detailList.stringify())
            }).where({
                id : picklistId
            })

          });

    
	} catch (error) {
		console.error("error at picklist inventory in supply beam", error);
		return await sendErrorResponse(500, "Internal server error ", error, res);
	}
};
