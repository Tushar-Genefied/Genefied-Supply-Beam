import { TableNames } from "../config/tableName";

type SupplyBeamSiteLocationsType = {
	location: string,
	status : string,
    address : string,
    country : string,
    state : string,
    district : string,
    city : string,
	created_by_id: number,
	created_by_name: string,
	updated_by_id: number,
	updated_by_name: string,
}

const SupplyBeamSiteLocations = function (this: any, supplyBeamSiteLocations: SupplyBeamSiteLocationsType) {
	this.location = supplyBeamSiteLocations.location;
	this.status = supplyBeamSiteLocations.status;
	this.address = supplyBeamSiteLocations.address;
	this.country = supplyBeamSiteLocations.country;
	this.state = supplyBeamSiteLocations.state;
	this.district = supplyBeamSiteLocations.district;
	this.city = supplyBeamSiteLocations.city;
	this.created_by_id = supplyBeamSiteLocations.created_by_id;
	this.created_by_name = supplyBeamSiteLocations.created_by_name;
	this.updated_by_id = supplyBeamSiteLocations.updated_by_id;
	this.updated_by_name = supplyBeamSiteLocations.updated_by_name;
};

SupplyBeamSiteLocations.findById = async (knexConnection: any, location_id: any, result: any) => {
    try {
      const res: any = await knexConnection
        .select()
        .from(TableNames.supplyBeamLocations)
        .where("supply_beam_locations.id", location_id);
  
      result(false, res[0]);
    } catch (error) {
      console.error("Error in SupplyBeamSiteLocations.findById: ", error);
      result(true, error);
    }
  };
  

SupplyBeamSiteLocations.getAllSupplyBeamSiteLocations = async (knexConnection:any, filters :any, result: any) => {
	try {
		let query = knexConnection.select("*").from(TableNames.supplyBeamLocations).where({
			status: "1"
	  });
  
	  let countQuery = knexConnection.count("* as total_users").from(TableNames.supplyBeamLocations).where({
			status: "1"
	  });
  
	  for (const key in filters) {
			if (Object.prototype.hasOwnProperty.call(filters, key)) {
		  if (key === "limit") {
					query = query.limit(filters[key]);
		  } else if (key === "offset") {
					query = query.offset(filters[key]);
		  } else {
					const lowercaseKey = key.toLowerCase();
					const lowercaseValue = filters[key].toLowerCase();
					query = query.whereRaw(`lower(${lowercaseKey}) like ?`, [`%${lowercaseValue}%`]);
					countQuery = countQuery.whereRaw(`lower(${lowercaseKey}) like ?`, [`%${lowercaseValue}%`]);
		  }
			}
	  }
  
	  const [data, count]: [any[], any[]] = await Promise.all([query, countQuery]);
  
	  result(false, { total: count[0].total_users, data: data });

	} catch (error) {
		console.error("Error at Get All Supply Beam actions in model ", error);
		result(true, error);
	}
	return;
};

SupplyBeamSiteLocations.getOutcodeAndOutcodetype = async (knexConnection: any, location_id: number) => {
    try {
      const res: any = await knexConnection
        .select('location_code','location_type','location_type_id')
        .from(TableNames.supplyBeamLocations)
        .where("supply_beam_locations.id", location_id);

		return res;
     
    } catch (error) {
      console.error("Error in SupplyBeamSiteLocations.findById: ", error);
	  return [];
    }
  };
  



export default SupplyBeamSiteLocations;