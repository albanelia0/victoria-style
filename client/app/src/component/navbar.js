import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../logic'
import '../design/App.css'
import '../design/navbar.css'

class Navbar extends Component {

  state = {
    token: '',
    isActive: 'is-active'
  }

  componentDidMount() {
    this.login()
    this.setState({
      isActive: this.props.isActive
    })
  }

  logout = () => {
    localStorage.clear()
    this.setState({
      token: undefined
    })
  }

  login = () => {
    let token = logic.localStorageGetItem("token")
    if (token) {
      this.setState({
        token: token
      })
    }
  }


  render() {
    return (
      <div className="hero-head header">
        <nav className="navbar">
          <div className="container">
            <div className="navbar-brand">
              <div className="logo">
                <p className="subtitle 2 title-navbar">Victoria Style</p>
              </div>
              {/* <span className="navbar-burger burger" data-target="navbarMenu">
                <span></span>
                <span></span>
                <span></span>
              </span> */}
            </div>
            <div id="navbarMenu" className="navbar-menu">
              <div className="navbar-end">
                <div className="tabs is-right">
                  {this.state.token ?
                    <ul className="subtitle is-4">
                      <li className={this.state.isActive}><Link to="/" >Home</Link></li>
                      <li><Link to="/profile">Profile</Link></li>
                      <li onClick={() => this.logout()}><Link to="/">Logout</Link></li> 
                    </ul>
                    :
                    <ul className="subtitle is-4">
                      <li><Link to="/" >Home</Link></li>
                      <li ><Link to="/login">Login</Link></li>
                    </ul>
                  }
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar