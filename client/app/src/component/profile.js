import React, { Component } from 'react'
import logic from '../logic'
import swal from 'sweetalert2'
// import 'font-awesome'
import '../design/profile.css'

class Profile extends Component {
  state = {
    result: []
  }

  //chapuzas eze
  componentDidMount(){
    this.listBookingUser()
  }

  listBookingUser = () => {
    let token = logic.localStorageGetItem("token")
    logic.setToken(token)

    if (token) {
      let userId = logic.localStorageGetItem("id")

      logic.listBookingUser(userId)
        .then(result => {
          this.setState({ result })
        })
    }
  }
  cancelBooking = (bookingId, userId) => {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.value) {
        logic.deleteBooking(bookingId, userId).then(() => {
          this.listBookingUser()
        })
      }
    })
  }

  showServicePrice = (result) => {
    let price = 0
    result.services.map((service) => {
      price += service.price
    })
    return price
  }
  showServiceDuration = (result) => {
    let _duration = 0;
    result.services.map((service) => {
      _duration += service.duration
    })
    return _duration
  }


  listBookingBox = () => {

    return this.state.result.map(result => {
      
      return (
        < div key={result.bookingId} className="booking">
          <article className="media">
            <div className="media-left">
            </div>
            <div className="media-content">
              <div className="content">
                <div>
                  <strong className="tag is-primary ">{result.services.map(service => `${service.serviceName}  \n,`)}</strong>
                  <br />
                  <ul>
                    {<li>Date:{result.date}</li>}
                    {<li>EndDate:{result.endDate}</li>}
                    {<li>Duration:{this.showServiceDuration(result)}min</li>}
                    {<li>Price:{this.showServicePrice(result)}€</li>}
                  </ul>
                </div>
              </div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item" aria-label="like">
                    <span className="icon is-small">
                      <i className="fa fa-heart" aria-hidden="true"></i>
                    </span>
                    <span className="icon is-small">
                      <i onClick={() => this.cancelBooking(result.bookingId, result.userId)} className=" delete  delete-booking is-danger" aria-hidden="true"></i>
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="profile">
        <h1 className="subtitle is-1 title-booking">My Bookings</h1>
        <div className="box bookingBox text-booking">
          {this.state.result.length ? this.listBookingBox() : <span>No bookings</span>}
        </div>
      </div>
    )
  }

}
export default Profile