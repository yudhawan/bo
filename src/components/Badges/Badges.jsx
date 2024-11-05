import React from 'react'
import style from "./Badges.module.scss";
import IconComponent from "../IconComponent/IconComponent"
import PropTypes from 'prop-types'

const Badges = ({model='primary', type='info', children='Label', iconLeft = null, iconRight = null}) => {

  let iconColor;

  if (model == 'primary') {

    type !== 'inactive' ? iconColor = style.fill_white : iconColor = style.fill_primary_inactive;

  } else {

    type !== 'inactive' ? iconColor = style[`fill_secondary_${type}`] : iconColor = style.fill_secondary_inactive;

  }

  return (
    <div className={`${style[`${model}_${type}`]} flex gap-[4px] items-center justify-center max-w-fit max-h-fit leading-[14.4px] text-[12px] p-[8px] rounded-[6px]`}>
      {iconLeft &&  <IconComponent loader={false} src={iconLeft} height={14} width={14} classname={`${iconColor}`}/>}
      {children}
      {iconRight &&  <IconComponent loader={false} src={iconRight} height={14} width={14} classname={`${iconColor}`}/>}
    </div>
  )
}

export default Badges

Badges.propTypes = {
  model:PropTypes.oneOf(['primary', 'secondary']),
  type:PropTypes.oneOf(['info', 'error', 'warning', 'success']),
  children:PropTypes.string,
  iconLeft:PropTypes.string,
  iconRight:PropTypes.string,
}
