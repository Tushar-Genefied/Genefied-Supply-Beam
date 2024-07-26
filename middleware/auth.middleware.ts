import { NextFunction } from "connect";
import { sendErrorResponse } from "../src/utils/utils";
import { getConnectionBySlug } from "../src/utils/connectionManager";
import { serverConfig } from "../src/config/enviroment";
import SBUser from "../src/models/supplyBeamUsers.model";
const JWT = require("jsonwebtoken");


export const protectSupplyBeam = async (
	req: any | Request,
	res: any | Response,
	next: NextFunction,
) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
		// // console.log(token, "TOKEN HERE");

		if (!token || token === "undefined" || token === undefined) {
			console.error("Token is missing");
			return await sendErrorResponse(401, "Token is missing", null, res);
		}

		try {
			const tenantKnexConnection = getConnectionBySlug(req.headers.slug);
			let checkUserActive = false;
			const decoded = JWT.verify(token, serverConfig.access_token_secrect);
			req.user = decoded;
			
			checkUserActive = await SBUser.checkPresent(tenantKnexConnection,req.user.employee_id);
			

			if (!checkUserActive) {
				console.error("User Not Active");
				return await sendErrorResponse(401, "User Not Active", false, res);
			}
			next();
		} catch (error) {
			console.error("Error at auth middleware ", error);
			await sendErrorResponse(401, "Unauthorized", error, res);
		}
	} else {
		console.error("Token is missing");
		await sendErrorResponse(401, "Token is missing", null, res);
	}
};



export const checkForSlug = async (
	req: any | Request,
	res: any | Response,
	next: NextFunction,
) => {
	try{
		let token;
	if (!req.headers.slug || req.headers.slug.length == 0) {
		return await sendErrorResponse(401, "please provide slug", null, res);
	}
	next();
	}catch(error : any){
		console.error("something went wrong",error);
		return await sendErrorResponse(500, "something went wrong", null, res);
	}	
};
