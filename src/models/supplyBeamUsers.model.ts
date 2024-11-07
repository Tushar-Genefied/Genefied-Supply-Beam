import { comparePassword } from "../utils/helper";


type SBUserType = {
	name: string;
	email: string;
	mobile: string;
	status: string;
	password: string,
	role_id: number,
	role_name: string,
	employee_id: string,
	designation: string,
	last_login? : any,
    location_id : any , 
    location_name : any,
	created_by_id: string,
	created_by_name: string,
	updated_by_id: string,
	updated_by_name: string,
}

const SBUser = function (sbUser: SBUserType) {
};


SBUser.checkPresent = async (knexConnection: any, employee_id: string) => {
	try {
		// console.log("employee_id we are here", employee_id);
		const res = await knexConnection.select("*").from("supply_beam_users").where("employee_id", employee_id);
		// console.log("object", res);
		if (res.length > 0) {
			return true;
		}
		return false;

	} catch (error) {
		console.error("Error at Check SB User present in model", error);
		return false;
	}
};

SBUser.compareSBUserPassword = async (knexConnection: any, SBUserData: any) => {
	try {
		const res: any = await knexConnection.select("*").from("supply_beam_users").where("employee_id", SBUserData.employee_id);
		return comparePassword(SBUserData.password, res[0].password);

	} catch (error) {
		console.error("Error at compare SB User password  in model", error);
		return false;
	}
};

SBUser.getSBUsersByEmployeeId = async function (knexConnection: any, employeeId: string, result: any) {
	try {
		const res: any = await knexConnection.select("*").from("supply_beam_users").where("employee_id", employeeId);
		delete res[0].password;
		result(false, res[0]);

	} catch (error) {
		console.error("Error at find SB User by employeeId in model", error);
		result(true, error);

	}
	return;

};
SBUser.getSBUsersById = async function (knexConnection: any, id: any, result: any) {
	try {
		const res: any = await knexConnection.select("*").from("supply_beam_users").where("id", id);
		result(false, res);

	} catch (error) {
		console.error("Error at find SB User by employeeId in model", error);
		result(true, error);

	}
	return;

};

SBUser.updateLoginTime = async (knexConnection: any, employeeId : string , last_login: any) => {
	try {
		const res = await knexConnection.from("supply_beam_users").update({last_login : last_login}).where({ "employee_id": employeeId });
		if(res){
			return true;
		}else {
			return false;
		}
	} catch (error) {
		console.error("Error at Update Login Time By Email in model ", error);
		return false;
	}
};

SBUser.updateById = async (knexConnection: any, user_id: number, details: any, result: any) => {
	try {

		const res = await knexConnection.from("supply_beam_users").update(details).where({ "id": user_id });

		result(null, { ...details, data: res });
	} catch (error) {
		console.error("Error at Update By Id in model ", error);
		result(true, error);;
	}
	return;
};

SBUser.countTotalUsers = async function (knexConnection: any, result: any) {
	try {
		const res: any = await knexConnection.count("id").from("supply_beam_users").where({ status: "1" });
		result(false, res[0]);

	} catch (error) {
		console.error("Error at Count Total Users in model", error);
		result(true, error);

	}
	return;
};

SBUser.checkUserActive = async (knexConnection: any, id: number) => {
	try {
		const res = await knexConnection
			.select("*")
			.from("supply_beam_users")
			.where({ id: id  , status : "1"});
		// // console.log("checkUserActive",res);
		if (res.length > 0) {
			return true;
		}
		return false;
	} catch (error) {
		console.error("Error at Check Tenant User Active in model", error);
		return false;
	}
};

export default SBUser;