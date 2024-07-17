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
        const {id : userId , name : userName , location_id : currentLocationId } = req.user;
        let whereLastLocation :any = {};

        whereLastLocation[qrStatusObject[qrType]];

			// last location
			return await QrLocations.lastLocations(tenantKnexConnection, whereLastLocation, async (lastLocationsError: Error, lastLocationsData: any) => {
				if (lastLocationsError) {
					return await sendErrorResponse(500,  "Something went wrong", lastLocationsData, res);
				}
				if (lastLocationsData.length === 0) {
					return await sendResponse(false, 409, "no location found", lastLocationsData, res);
				} else {
                    // Last location should be IN 
                    if(lastLocationsData[0].batch_type != 'IN'){
                        return await sendResponse(false, 409, "You can not checkout before checkout in ", lastLocationsData, res);
                    }

                    if( currentLocationId != 0 ){
                        
                        // last location should matched with current location
                        if(  lastLocationsData[0].location_id != currentLocationId  ){
                            return await sendResponse(false, 409, "location of last check in and current checkout did not matched ", lastLocationsData, res);
                        }
                    }else{
                         // for user type like distributor or retailer user id should match
                        if(  lastLocationsData[0].user_id != userId  ){
                            return await sendResponse(false, 409, "location of last check in and current checkout did not matched ", lastLocationsData, res);
                        }
                    }

                    return await sendResponse(true, 200, "qr has been verified and ready to checkout ", lastLocationsData, res);

				}
			});

	} catch (error) {
		console.error("error at verifying qr in supply beam", error);
		return await sendErrorResponse(500, "Error at verifying QR ", error, res);
	}
};
