import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import style from './ToogleButton.module.scss'
const ToogleButton = ({
  textActive,
  textInactive,
  onClick,
  type="primary",
  value=false,
  disabled=false,
  ...props
}) => {
  const [getValue,setValue]=useState()
  const handleValue =()=> {
    onClick&&onClick(!getValue)
    onClick&&setValue(!getValue)
  }
  const styleDisabled = disabled & getValue?style.disabled_active_primary:disabled & !getValue?style.disabled_inactive_primary:''
  useEffect(()=>{
    setValue(value)
  },[value])
  
  return (
    <div className={`${styleDisabled} flex items-center gap-2 w-fit`} {...props}>
      <button
        style={{backgroundColor:getValue?'#176CF7':'#434343'}}
        className={style.main+` ${getValue?style[type]:style.inactive}`} 
        onClick={handleValue} 
        disabled={disabled}>
        <span 
          style={{
            transform:`translateX(${getValue?'16.5px':'0'})`
          }}
          className={style.dot}></span>
      </button>
      {!!(textActive||textInactive)&&<span className={style.text+' capitalize select-none'}>{
        getValue?textActive:textInactive
      }</span>}
    </div>
  )
}
export default ToogleButton
ToogleButton.propTypes={
  textActive: PropTypes.string,
  textInactive: PropTypes.string,
  type:PropTypes.oneOf(["primary","secondary"]),
  onclick:PropTypes.func,
  value:PropTypes.bool,
  disabled:PropTypes.bool
}