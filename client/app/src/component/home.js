import React, { Component } from 'react';
import { Dropdown } from './dropdown'
import '../design/home.css'
import img from '../design/logofucsia-1.png'
// import 'bulma/js/bulma.js';

const images = [
  '/images/0.jpg',
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/carlos.jpeg',
  '/images/indra.jpeg'
]

class Home extends Component {

  state = {
    image: '/images/0.jpg'
  }

  componentDidMount() {
    this._handleImages()
  }

  _handleImages = () => {
    setInterval(() => {
      let i = images.indexOf(this.state.image)
      i = (i + 1) % images.length;
      this.setState({
        image: images[i]
      })
    }, 3000)
  }

  render() {
    return (
      <div className="container has-text-centered">
        <section class="hero is-small">
            <div className="images-header">
              <img className="image-screen" src={'/images/ScreenShot.png'} />
            </div>
          <div class="hero-body">
            <div className="container summary">
              <p className="subtitle">
                <h3>From Monday to Saturday from 8 am to 5 pm</h3>
                ask for an appointment!
              We will do our best to satisfy your wishes!</p>
            </div>
          </div>
        </section>
        <div className="columns is-vcentered">
          <div className="column is-5">
            <figure className="image">
              <div
                className="the-image"
                style={{ backgroundImage: `url(${this.state.image})` }}
              />
            </figure>
          </div>
          <div className="column is-6 is-offset-1">
            <p className="subtitle is-1 is-spaced">Book days</p>
            <Dropdown />
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
