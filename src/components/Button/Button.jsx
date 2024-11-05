import React from 'react'
import style from "./Button.module.scss";
import IconComponent from "../IconComponent/IconComponent"
import PropTypes from 'prop-types'

const Button = ({color = 'primary',type="button" , children = 'Button', name, onClick, Class = '', iconLeft = null, iconRight = null ,disabled= false}) => {

  /*
    @params color = ['primary', 'primary_secondary', 'error', 'error_secondary', 'warning']
    
    @params disabled = true or false
  */
  
  let disabledProp = '';
  let colorIcon;

  if (!color.includes('secondary')) {
    colorIcon = style['fill_white'];
  } else {
    colorIcon = style[`fill_${color.split('_')[0]}`]
  }

  if (disabled && color.includes('secondary')) {
    disabledProp = style['btn_disabled_secondary']
  } else if(disabled) {
    disabledProp = style['btn_disabled']
  }
  

  return (
    <button name={name} type={type} onClick={onClick} disabled={disabled} className={`${style[`btn_${color}`]} ${disabledProp} ${style.btn} flex justify-center items-center gap-[4px] min-w-[112px] max-w-fit transition-colors leading-[16.8px] text-[14px] px-[24px] py-[11px] rounded-[24px] ${Class}`}>
      {iconLeft && <IconComponent loader={false} src={iconLeft} height={16} width={16} classname={disabled ? style['fill_disabled'] : colorIcon }/>}
        {children}
      {iconRight && <IconComponent loader={false} src={iconRight} height={16} width={16} classname={disabled ? style['fill_disabled'] : colorIcon}/>}
    </button>
  )
} 

export default Button

Button.propTypes = {
  color:PropTypes.oneOf(['primary', 'primary_secondary', 'error', 'error_secondary', 'warning']),
  name:PropTypes.string.isRequired,
  onClick:PropTypes.func.isRequired,
  Class:PropTypes.string,
  iconLeft:PropTypes.string,
  iconRight:PropTypes.string,
  disabled:PropTypes.bool
}

