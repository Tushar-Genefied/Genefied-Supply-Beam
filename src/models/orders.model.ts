import { TableNames } from "../config/tableName";

type ordersType = {
    order_no: string;
    uom: string;
    remarks: string;
    status?: string;
    qty: number;
    source: string;
    no_of_items: number;
    invoice_no: string;
    customer_code: number;
    location_code: string;
};

const Orders = function (this: ordersType, OrdersData: ordersType) {
	this.order_no = OrdersData.order_no;
	this.uom = OrdersData.uom;
	this.remarks = OrdersData.remarks;
	this.status = OrdersData.status;
	this.source = OrdersData.source;
	this.qty = OrdersData.qty;
	this.no_of_items = OrdersData.no_of_items;
	this.invoice_no = OrdersData.invoice_no;
	this.customer_code = OrdersData.customer_code;
	this.location_code = OrdersData.location_code;

};

Orders.create = async (knexConnection: any, newOrders: ordersType, result: any) => {
	try {
		const res = await knexConnection
			.insert(newOrders)
			.into(TableNames.checkoutQrs)
			.returning("id");
		result(false, { ...newOrders, id: res[0].id });
	} catch (error) {
		console.error("Error at Add new Orders in model ", error);
		result(true, error);
	}
};

Orders.checkOrderIDAlreadyPresent = async (knexConnection: any, orderID: number ) => {
	try {
		const res = await knexConnection
			.select("*")
			.from(TableNames.orders)
            .where({
                id : orderID
            })
		if( res.length > 0){
            return true;
        }
        return false;
	
	} catch (error) {
		console.error("Error at order ID already exist check in model ", error);
		return false;
	}
};


export default Orders;