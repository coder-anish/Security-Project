import React from 'react';
import {TbAlertCircle} from 'react-icons/tb';
const Alert = ({success,message}) => {


  return (
    <div className={success?'new':'d-none'}>
      <TbAlertCircle/>
      <p>{message}</p>
    </div>
  )

}

export default Alert
