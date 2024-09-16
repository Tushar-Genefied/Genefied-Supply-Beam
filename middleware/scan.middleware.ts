import { NextFunction } from "connect";
import QR from "../src/models/qr.model";
import { getConnectionBySlug } from "../src/utils/connectionManager";
import { sendErrorResponse, sendResponse } from "../src/utils/utils";

export const basicQrValidation = async (req: Request | any, res: Response | any , next : NextFunction ) => {
	try {
		const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
        
		if (!req.body || !req.body.unique_code) {
			return await sendResponse(false, 400, "Bad Request ", null, res);
		}
        
		const uniqueCode = req.body.unique_code.trim();
        
		// First, check if the QR code exists
		return await QR.getQrByUniqueCode(tenantKnexConnection, uniqueCode, async (error: Error, data: any) => {
			if (error) {
				return await sendErrorResponse(500, "Something went wrong", data, res);
			}
            
			if (data === undefined) {
				return await sendResponse(true, 200, "Not Found, This QR is not activated yet", null, res);
			}    
			req.body.qr_details = data;
            next();
		});
        
	} catch (error) {
		console.error("error at verifying qr in supply beam", error);
		return await sendErrorResponse(500, "Error at verifying QR ", error, res);
	}
};
