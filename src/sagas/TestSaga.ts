import { takeEvery,put, select, all,  } from "redux-saga/effects";
import { testSampleSuccess } from "../actions/TestAction";


export const name =(state :any)=>state.testReducer;

function* testSample(){
    let model = yield select(name);
    console.log("saga model...........",model)
    yield put(testSampleSuccess('KG'))
}

// export function* testSaga(){
//     yield takeEvery('TEST_SAMPLE',testSample)
// }

export const testSaga = [
    takeEvery('TEST_SAMPLE',testSample),
]

export default function * rootSaga() {
    yield all([...testSaga]);
}