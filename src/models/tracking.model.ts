import { TableNames } from "../config/tableName";

interface ExtraDataType {
    batch_id: number;
    user_id: number;
    user_name: string;
    location_id : number;
    user_role_id : number
  }

const getQrTrackInfo = async (knexConnection: any, parentAndChildQrs : any , extraData : ExtraDataType ) => {
	try {
		const qrtypeList = await knexConnection.select("id" , "qr_type").from(TableNames.qr).whereIn("id",parentAndChildQrs);

        let qrcodeIdTypeMap : any = {};
        for( let i = 0; i < qrtypeList.length; i++ ){
            const x = qrtypeList[i];
            qrcodeIdTypeMap[x.id] = x.qr_type;
        }   
		const qrcodeDataList = await knexConnection.select("id as qr_id " , "pqr_id" , "qr_type" ).from(TableNames.qr).whereIn("id",parentAndChildQrs).whereIn("pqr_id",parentAndChildQrs);

        let finalQrData : any = [];
        for( let i=0 ;i < qrcodeDataList.length ;i++ ){
            const x = qrcodeDataList[i];

            // if qrcodeIdTypeMap has qr_id and qr_type == 1 then it is a child
            // it mean child scanned
            if( qrcodeIdTypeMap.hasOwnProperty(x.qr_id)  && qrcodeIdTypeMap[x.qr_id] == '1' ){
                finalQrData.push({
                    qr_id : x.qr_id,
                    pqr_id : x.pqr_id,
                    cqr_id : x.cqr_id,
                    qr_type : x.qr_type,
                    user_id : extraData.user_id,
                    user_name : extraData.user_name,
                    batch_id : extraData.batch_id
                })
            }
            // if qrcodeIdTypeMap do not have qr_id then it is also a child 
            // because we must have got these child qr from second query .
            else if (  !qrcodeIdTypeMap.hasOwnProperty(x.qr_id) ){
                finalQrData.push({
                    qr_id : x.qr_id,
                    pqr_id : x.pqr_id,
                    cqr_id : x.cqr_id,
                    qr_type : "2",
                    user_id : extraData.user_id,
                    user_name : extraData.user_name,
                    batch_id : extraData.batch_id
                })
            }
        }

        return finalQrData;

	} catch (error) {
		console.error("Error at Add Checkout in model ", error);
        return [];
	}
};

const createTrackingQrData =  async (knexConnection: any, cartonQrs : number[] | [] , parentAndChildQrs : number[] , extraData : ExtraDataType ) => {
	try {
        let finalParentAndChildQrs = [];
        // if cartonQrs are present , then we need retrive its child qrs , ( carton --> parent --> child ) means parent 

        let cartonParentQrs : any = {};

        if( cartonQrs.length  > 0 ){
            const res = await knexConnection.select("id" , "pqr_id" ).from(TableNames.qr).whereIn("pqr_id",cartonQrs).where("qr_type",'2');


            if( res.length > 0 ){
                for( let i = 0 ;i<res.length ;i++ ){

                    cartonParentQrs[res[i].id]=res[i].pqr_id;
                    finalParentAndChildQrs.push(res[i].id);
                }
            }
        }
        finalParentAndChildQrs = [ ...finalParentAndChildQrs , ...parentAndChildQrs];

        if( finalParentAndChildQrs.length ==  0 ){
            return [];
        }

        // get getQrTrackInfoResp will gave parent and child combinations only
        let getQrTrackInfoResp = await getQrTrackInfo(knexConnection ,finalParentAndChildQrs ,  extraData );

        // if cartonParentQrs.length > 0 , then there are some parent whose are
        // child of these carton qrs , it means cartons is scanned

        
            for( let j = 0 ;j<getQrTrackInfoResp.length ;j++ ){
                const y = getQrTrackInfoResp[j];

                // carton is scanned 
                if( cartonParentQrs[y.cqr_id] == y.pqr_id){
                    getQrTrackInfoResp[j]['qr_type'] = '3';
                }
            }
        

        return getQrTrackInfoResp;
	} catch (error) {
		console.error("Error at Add Checkout in model ", error);
        return [];
	}
};

interface QrsType {
    id : number;
    qr_type : string;
}

const createTracking = async (knexConnection: any, trackingType : string , qrs :QrsType[] , extraData :ExtraDataType ) => {
	try {
        let cartonqrs = [];
        let parentAndChildQrs = [];
        for( let i =0 ;i < qrs.length ;i++ ){
            if( qrs[i].qr_type == '3'){
                cartonqrs.push(Number(qrs[i].id));
            }else{
                parentAndChildQrs.push(Number(qrs[i].id));
            }
        }

        const trackingQrsData = await createTrackingQrData(knexConnection , cartonqrs, parentAndChildQrs , extraData);

        let tableName = "";

        if( trackingType == 'IN'){
            tableName = TableNames.checkInQrs;
        }else if( trackingType == 'OUT'){
            tableName = TableNames.checkoutQrs
        }else if ( trackingType == 'RETURN'){
            tableName = TableNames.returningQrs
        }
        let qrsLoactionsData : any = [];
        await knexConnection.transaction(async (trx : any ) => {
            const trackingInsert = await trx(tableName)
              .insert(trackingQrsData)
              .returning('id');
    
            
            for( let i =0 ;i < trackingQrsData.length ;i++ ){
                const x = trackingQrsData[i];
                qrsLoactionsData.push({
                    ...x,
                    location_id : x.location_id,
                    user_role_id : x.user_role_id,
                })
            }

            const qrsLocationsInsert = await trx(TableNames.qrLocations)
            .insert(trackingQrsData)
            .returning('id');

          });
          
          return {
            success : true,
            data : qrsLoactionsData
          }
	} catch (error) {
		console.error("Error at Add Checkout in model ", error);
		return {
            success : false,
            data : []
        };
	}
};

export {
    createTracking
};