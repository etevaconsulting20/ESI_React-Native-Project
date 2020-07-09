import { actionTypes } from "../actions/types"

const initialState={
    name:''
}

export const testReducer = (state=initialState , action:any) => {
    switch(action.type){
        case actionTypes.TEST_SAMPLE:
                console.log("reducer.....",action);
            return{...state,name:action.payload}

        case actionTypes.TEST_SAMPLE_SUCCESS:
            console.log("success reducer.....",action);
                return{...state,name:action.payload}
        
            default : return state
    }
}