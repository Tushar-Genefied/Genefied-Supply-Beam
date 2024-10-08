import QrLocations from "../../models/qrLocations.model";
import { getConnectionBySlug } from "../../utils/connectionManager";
import { qrStatusObject } from "../../utils/helper";
import { sendErrorResponse, sendResponse } from "../../utils/utils";

export const verifyQrCodeAtCheckout = async (req: Request | any, res: Response | any) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        
		if (!req.body || !req.body.unique_code || !req.body.qr_details)  {
			return await sendResponse(false, 400, "Bad Request", null, res);
		}
        
		const uniqueCode = req.body.unique_code.trim();
        const qrDetails = req.body.qr_details;
        const qrType   = req.body.qr_details.qr_type.toString();
        const {id : userId , name : userName , location_id } = req.user;
        const currentLocationId =location_id ;
        let whereLastLocation :any = {};

        whereLastLocation[qrStatusObject[qrType]]=qrDetails.id;



			// last location
			return await QrLocations.lastLocations(tenantKnexConnection, whereLastLocation, async (lastLocationsError: Error, lastLocationsData: any) => {
				if (lastLocationsError) {
					return await sendErrorResponse(500,  "Something went wrong", lastLocationsData, res);
				}
				if (lastLocationsData.length === 0) {
					return await sendResponse(false, 409, "no checkin found", lastLocationsData, res);
				} else {
                    // Last location should be IN 
                    if(lastLocationsData[0].batch_type != 'IN'){
                        return await sendResponse(false, 409, "You can not checkout before checkout in ", {}, res);
                    }

                    if( currentLocationId != 0 ){
                        
                        // last location should matched with current location
                        if(  lastLocationsData[0].location_id != currentLocationId  ){
                            return await sendResponse(false, 409, "location of last check in and current checkout did not matched ", {}, res);
                        }
                    }else{
                         // for user type like distributor or retailer user id should match
                        if(  lastLocationsData[0].user_id != userId  ){
                            return await sendResponse(false, 409, "location of last check in and current checkout did not matched ", {}, res);
                        }
                    }

                    const isAlreadyScanned = await QrLocations.isQrAlreadyCheckInOutAtThisLocation(tenantKnexConnection,{
                        location_id : currentLocationId[0],
                        [qrStatusObject[qrType]] : qrDetails.id,
                        batch_type : 'OUT'
                    })
            
                    // at current location , is this qr already checked out
                    if( isAlreadyScanned){
                        return await sendResponse(false, 409, "This Qrs is already check out at this location ", {}, res);
                    }

                    return await sendResponse(true, 200, "qr has been verified and ready to checkout ", qrDetails, res);

				}
			});

	} catch (error) {
		console.error("error at verifying qr in supply beam", error);
		return await sendErrorResponse(500, "Error at verifying QR ", error, res);
	}
};
