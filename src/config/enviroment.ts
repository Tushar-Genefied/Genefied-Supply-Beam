
if (process.argv[2] === "prod") {
	
	require("dotenv").config({
		path: __dirname + "/../.env"
        
	});
	
} else if (process.argv[2] === "test") {
	
	require("dotenv").config({
		path: __dirname + "/../.env.test"
        
	});
	
} else {
	require("dotenv").config({
		path: __dirname + "/../.env.dev"
	}); 
}

export const serverConfig = {
	mode:process.env.MODE,
	port : process.env.PORT,
	db_client:process.env.DB_CLIENT,
	db_user:process.env.DB_USER,
	db_port:process.env.DB_PORT,
	db_host:process.env.DB_HOST,
	db_database:process.env.DB_DATABASE,
	db_password:process.env.DB_PASSWORD,
};
