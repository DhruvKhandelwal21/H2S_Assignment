import { ObjectId } from "mongodb";

// common function for converting _id with handling errors.
export const ObjectIdWithErrorHandler = (id: string | ObjectId | undefined) => {
    try {
      return new ObjectId(id);
    } catch (e) {
    //   throw new ApiError(400, "Invalid resource id");
    }
  };

  // helper function to update deeply nested properties
export const updateCompose = (filter: string, payload: any)=>{
  let res:any = {};
  Object.keys(payload).map((item)=>{
    const key = `${filter}.${item}`
     res[key] = payload[item];
  })
  return res;
}

// helper function for asynchronously performing i/o operations on large array datasets

export async function asyncForEach(array: any[], callback: (item: any, index: number) => Promise<void>) {
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
  }
}