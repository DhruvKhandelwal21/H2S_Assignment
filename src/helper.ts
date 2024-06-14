import { ObjectId } from "mongodb";

export const ObjectIdWithErrorHandler = (id: string | ObjectId | undefined) => {
    try {
      return new ObjectId(id);
    } catch (e) {
    //   throw new ApiError(400, "Invalid resource id");
    }
  };

export const updateCompose = (filter: string, payload: any)=>{
  let res:any = {};
  Object.keys(payload).map((item)=>{
    const key = `${filter}.${item}`
     res[key] = payload[item];
  })
  return res;
}