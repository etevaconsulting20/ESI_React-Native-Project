import { actionTypes } from "./types";

export const testSample = (name:any) => ({
    type : actionTypes.TEST_SAMPLE,
    payload : name
})
export const testSampleSuccess = (model:any) => ({
    type : actionTypes.TEST_SAMPLE_SUCCESS,
    payload : model
})