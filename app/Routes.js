import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import Home from './containers/Home/index';
import Login from './containers/Login/index';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.DASHBOARD} component={Home} />
        <Route path={routes.LOGIN} component={Login} />
      </Switch>
    </App>
  );
}
