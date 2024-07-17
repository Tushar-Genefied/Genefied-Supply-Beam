import {  Response, NextFunction } from "express";


export async function sendResponse(
	success : boolean ,
	statusCode : number, 
	message : string ,
	body : any ,
	res: Response,

) {

	let msg = message;

	if(!msg){
		msg = "Some Error Occurred";
	}
    
	const responseObject = {
		status : statusCode,
		success : success,
		message : msg,
		body : body,
	};
    

	res.status(statusCode).send(responseObject);  
  
};

export async function sendErrorResponse(
	statusCode : number, 
	message : string ,
	error : Error | any ,
	res: Response,

) {

	let msg = message;

	if(!msg){
		msg = "Some Error Occurred";
	}
    
	const responseObject = {
		success : false,
		message : msg,
		Error : error,
	};

	res.status(statusCode).send(responseObject);  
  
};
