import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './App';
import Home from './containers/Home/Home';
import Signup from './containers/Users/Signup/Signup';
import Login from './containers/Users/Login/Login';
import FullArticle from './containers/Articles/FullArticle/FullArticle';
import AddArticle from './containers/Articles/AddArticle/AddArticle';
import EditArticle from './containers/Articles/EditArticle/EditArticle';
// import NavigationBar from './containers/NavigationBar/NavigationBar';
import ControlPanel from './containers/ControlPanel/ControlPanel';

class Appv2 extends Component {
    render() {
        return (
            <div className="container-fluid">
                {/* <NavigationBar /> */}
                <Switch>
                    <Route exact path="/article/add" component={AddArticle} />
                    <Route path="/article/edit/:id" component={EditArticle} />
                    <Route path="/articles/:id" component={FullArticle} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/home" component={Home} />
                    <Route path="/cp" component={ControlPanel} />
                    <Route path="/" component={App} />
                    
                </Switch>
            </div>
        );
    }
}

export default Appv2;
