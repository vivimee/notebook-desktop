import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import notebook from './notebook';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    notebook,
  });
}
