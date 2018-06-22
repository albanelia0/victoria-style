
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import logic from '../logic'
import '../design/dropdown.css'
import swal from 'sweetalert2'

let day = new Date()
const year = day.getFullYear()

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let month = monthNames[day.getMonth()];
const monthNumber = day.getMonth() + 1
export class Dropdown extends Component {

  state = {
    _month: '',
    checkedList: [],
    _year: 2018, 
    title: 'Choose your service'
  }


  componentDidMount() {
    this.setState({
      _month: month,
      _monthNumber: 6
    })
  }

  alertSelectedServices(){
    swal({
      type: 'error',
      title: 'Please, first select the service',
    })
  }

  listServices = () => {
    return logic.listServices()
      .then(async services => {
        const { value: formValues } = await swal({
          title: 'choose your service',
          html:
            services.map(service => {
              return `
                <div class="drobdownList">
                  <label>
                    <input id="${service.serviceId}" type="checkbox">
                    <span>${service.serviceName}/${service.duration}min/${service.price}€</span>
                  </label>
                </div>`
            }).join(''),
          focusConfirm: false,
          preConfirm: () => {
            const checkedAtLeastOne = services.reduce((someAreChecked, service) => {
              return someAreChecked || document.getElementById(service.serviceId).checked
            }, false)

            if (!checkedAtLeastOne) {
              return swal.showValidationError('No service is selected!')
            }

            return services.filter(service => document.getElementById(service.serviceId).checked)
          }
        })

        if (formValues) {

          let checkedList = formValues
          
          logic.localStorageSetItem('checkedList', JSON.stringify(checkedList))

          this.setState({ checkedList, title:checkedList[0].serviceName }, () => {
            swal('Perfect! chosen service, choose the date / time and go!')
          })

        }
      })
  }

  changeMonth = (e) => {
    const name = e.target.getAttribute('name')
    if (name == 1) {
      this.setState({
        _month: monthNames[day.getMonth() + 1],
        _monthNumber: day.getMonth() + 2
      })
    } else if (name == 2) {
      this.setState({
        _month: monthNames[day.getMonth() + 2],
        _monthNumber: day.getMonth() + 3
      })
    } else if (name == 3) {
      this.setState({
        _month: monthNames[day.getMonth() + 3],
        _monthNumber: day.getMonth() + 4
      })
    } else if (name == 4) {
      this.setState({
        _month: monthNames[day.getMonth() + 4],
        _monthNumber: day.getMonth() + 5
      })
    } else if (name == 5) {
      this.setState({
        _month: monthNames[day.getMonth() + 5],
        _monthNumber: day.getMonth() + 6
      })
    } else if (name == 6) {
      this.setState({
        _month: monthNames[day.getMonth() + 6],
        _monthNumber: day.getMonth() + 7
      })
    } else if (name == 7) {
      this.setState({
        _month: monthNames[day.getMonth() - 5],
        _monthNumber: day.getMonth() + 8
      })
    } else {
      this.setState({
        _month: month,
        _monthNumber: day.getMonth() + 1
      })
    }
  }

  changeYear = (e) => {
    const name = e.target.getAttribute('name')
    if (name == 1) {
      this.setState({
        _year: year
      })
    } else if (name == 2) {
      this.setState({
        _year: year + 1
      })
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.listServices} class="button is-large" aria-haspopup="true" aria-controls="dropdown-menu3">
          <span>{this.state.title}</span>
          <span class="icon is-small">
          </span>
        </button>
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button class="button is-large" aria-haspopup="true" aria-controls="dropdown-menu3">
              <span>{this.state._year}</span>
              <span class="icon is-small">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu3" role="menu">
            <div class="dropdown-content">
              <a onClick={this.changeYear} name='1' class="dropdown-item">
                {2018}
              </a>
              <a onClick={this.changeYear} name='2' class="dropdown-item">
                {2019}
              </a>
            </div>
          </div>
        </div>
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button class="button is-large" aria-haspopup="true" aria-controls="dropdown-menu4">
              <span>{this.state._month}</span>
              <span class="icon is-small">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu4" role="menu">
            <div class="dropdown-content">
              <a onClick={this.changeMonth} name="1" class="dropdown-item">
                {"July"}
              </a>
              <a onClick={this.changeMonth} name="2" class="dropdown-item">
                {"August"}
              </a>
              <a onClick={this.changeMonth} name="3" class="dropdown-item">
                {"September"}
              </a>
              <a onClick={this.changeMonth} name="4" class="dropdown-item">
                {"October"}
              </a>
              <a onClick={this.changeMonth} name="5" class="dropdown-item">
                {"November"}
              </a>
              <a onClick={this.changeMonth} name="6" class="dropdown-item">
                {"December"}
              </a>
              <a onClick={this.changeMonth} name="7" class="dropdown-item">
                {"January"}
              </a>
            </div>
          </div>
        </div>
        <div>
          {this.state.checkedList.length > 0 ? <Link to={`/calendar/${this.state._year}/${this.state._monthNumber}`} className="button is-info is-medium">check days</Link> :
            <Link to='/' className="button is-info is-medium"  title="Disabled button" onClick={this.alertSelectedServices} >check days</Link>
          }
        </div>
      </div>
    )
  }
}

