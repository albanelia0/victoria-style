import React, { Component } from 'react';
import Home from './component/home'
import Calendar from './component/calendar'
import {PrivateRoute} from './component/privateRoute'
import { Switch, Route } from 'react-router-dom'
import { Login } from './component/login';
import { Register } from './component/register';
import BookingHours from './component/bookingHours';
import Profile from './component/profile';
import ConfirmBooking from './component/confirmBooking';
import './design/App.css';
import Navbar from './component/navbar';

class App extends Component {
  render() {
    return (
      <section className="hero is-fullheight is-default is-bold">
        <Navbar ref={navbar => navbar ? this.navbarLogin = navbar.login : null} />
        <div className="hero-body">
          <Switch>
            <Route exact path='/' isActive='is-active' component={Home} />
            <Route exact path='/calendar/:year/:month' component={Calendar} />
            <Route exact path='/calendar/:year/:month/:day' component={BookingHours}/>
            <Route path='/login' isActive='is-active' render={(routeProps) => <Login {...routeProps} navbarLogin={this.navbarLogin} />} />
            <Route path='/register'  component={Register} />
            <PrivateRoute path="/profile" isActive='is-active' component={Profile} />
            <PrivateRoute path="/confirmBooking" component={ConfirmBooking} />
          </Switch>
        </div>
        <div className="hero-foot">
          <div className="container">
            <div className="tabs is-centered">
              <ul>
                <li><a>And this is my project</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default App;
