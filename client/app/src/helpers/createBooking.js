import React from 'react'
import logic from '../logic'
import moment from 'moment'
import swal from 'sweetalert2'

function createBooking() {
  let checkedList = localStorage.getItem("checkedList")
  checkedList = JSON.parse(checkedList)
  let userId = localStorage.getItem("id")
  let date = localStorage.getItem("date")
  let hour = localStorage.getItem("hour")
  
  const _date = moment(date + " " + hour).format()

  const serviceIds = []
  if (checkedList) {

    checkedList.map(service => {
      serviceIds.push(service.serviceId)
    })
  }
  console.log({userId, serviceIds, _date})
  return logic.placeBooking(userId, serviceIds, _date)
    .then(booking => {
      if (booking == "unavailable") {
        // alerta de prueba
        swal({
          type: 'error',
          title: 'the services exceed the limit of available hours! I am sorry! but you should choose another available hour',
          // text: data.error
        })
        // alert("los servicios superan el limite de horas disponibles!lo siento! pero deberias elegir otra hora dispobible")
        return false
      } else {
        return true
      }

      //return booking
    })

}


export default createBooking