import React from "react";
import ReactDOM from "react-dom";
import Appv2 from "./Appv2";
// import App from "./App";
import "./index.css";
import "../semantic/dist/semantic.min.css";
import './index.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import articlesReducer from './store/reducers/articlesReducer';
import usersReducer from './store/reducers/usersReducer';
import roleReducer from './store/reducers/roleReducer';

// import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({
    articles: articlesReducer,
    users: usersReducer,
    roles : roleReducer
});

// const composeEnhancers =
//   typeof window === 'object' &&
//   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//     }) : null;

// const enhancer = composeEnhancers(
//   applyMiddleware(thunk),
//   // other store enhancers if any
// );
// const store = createStore(rootReducer, enhancer);


const store = createStore(rootReducer, applyMiddleware(thunk));

const app = (
    <Provider store={store}>
        <Router>
            <Appv2 />
        </Router>
    </Provider>
);

ReactDOM.render(
  app,
  document.getElementById("root") // eslint-disable-line no-undef
);
