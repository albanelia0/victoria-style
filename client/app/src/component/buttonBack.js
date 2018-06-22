import React from 'react'
import { Link } from 'react-router-dom'

export const ButtonBack = (props) => {
  const { direction, name } = props
  return (
    <Link
      className='button is-info'
      to={direction}>
      Back to {name}
    </Link>
  )
}