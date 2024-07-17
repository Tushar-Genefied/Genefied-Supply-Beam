import { serverConfig } from "../config/enviroment";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export const getHash = async function (password: string) {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	return hashedPassword;
};

export const comparePassword = async function (reqPassword: string, hashedPassword: string) {
	if (!reqPassword || !hashedPassword) {
		return Promise.resolve(false);
	}
	return bcrypt.compare(reqPassword, hashedPassword);
};

export const getToken = function (data: any) {
	const token_secret = serverConfig.access_token_secrect;
	return jwt.sign(data, token_secret);
};
