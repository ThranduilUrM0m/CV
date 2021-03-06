import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.scss';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import App from './components/App/App';
import NotFound from './components/App/NotFound';
import Home from './components/Home/Home';
import Blog from './components/Blog/Blog';
import Post from './components/Post/Post';
import About from './components/About/About';
import Minttea from './components/Minttea/Minttea';
import ContactMe from './components/ContactMe/ContactMe';
import Process from './components/Process/Process';
import Login from "./components/Login/Login.js";
import Signup from "./components/Signup/Signup.js";
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Confirmation from './components/Confirmation/Confirmation';
import * as serviceWorker from './serviceWorker';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-174900398-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/blog" component={Blog} />
                    <Route path={`/blog/:postId`} component={Post} />
                    <Route exact path='/about' component={About} />
                    <Route exact path='/minttea' component={Minttea} />
                    <Route exact path='/contact' component={ContactMe} />
                    <Route exact path='/process' component={Process} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={Signup} />
                    <Route path={`/confirmation/:token_id`} component={Confirmation} />
                    <PrivateRoute path='/dashboard' component={Dashboard} />
                    <Route component={NotFound} />
                </Switch>
            </App>
        </Provider>
    </Router>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
