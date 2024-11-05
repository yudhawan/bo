import React from 'react'
import PropTypes from 'prop-types'
import style from "./RadioButton.module.scss";

const RadioButton = ({name, label, checked, onChange, value, disabled, children}) => {
  return (
    <div className={`${style.container_radio} flex gap-[8px] items-center`}>
        <input type="radio" checked={checked} name={name} onChange={onChange} value={value} disabled={disabled}/>
        <span className={`${style.radio_primary}`}></span>
        {
          children ? children : label
        }
    </div>
  )
}

export default RadioButton

RadioButton.propTypes = {
  name:PropTypes.string.isRequired,
  label:PropTypes.string,
  checked:PropTypes.bool,
  onChange:PropTypes.func.isRequired,
  value:PropTypes.string.isRequired,
  disabled:PropTypes.bool,
}
