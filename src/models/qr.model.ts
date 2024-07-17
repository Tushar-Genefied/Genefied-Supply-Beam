import { parentPort } from "worker_threads";
const path = require("path");
const fs = require("fs");
import { Readable } from "stream";

export type QrType = {
  generation_id: number;
  batch_running_code: string;
  batch_code: string;
  product_code: string;
  unique_code: string;
  scratch_code: string;
  parent_code: string;
  mrp: number;
  qr_status: string;
  created_at: string;
  created_by_id: number;
  created_by_name: string;
};

const QR = function (qr: QrType) {
  //
};

QR.getQrByUniqueCode = async (
  knexConnection: any,
  unique_code: string,
  result: any
) => {
  try {

    const res: any = await knexConnection
      .select("qr.*", "products.name")
      .from("qr")
      .join("products", "products.product_code", "=", "qr.product_code")
      .where("qr.unique_code", unique_code);

    result(false, res[0]);
  } catch (error) {
    console.error("Error at get qr by unique code in model ", error);
    result(true, error);
  }
  return;
};

export default QR;
