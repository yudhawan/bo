'use client'
import React, { useState } from 'react'
import style from './TextArea.module.scss'
import PropTypes from 'prop-types'
import IconComponent from "../IconComponent/IconComponent"

const TextArea = ({
    name, 
    type='text', 
    placeholder = 'Placeholder', 
    disabled = false,
    status = null,
    value = '',
    supportiveText = {title: '', desc: ''},
    width = {width: '', maxWidth: '', minWidth: ''},
    ref = null,
    resize = '',
    changeEvent = () => {},
}) => {
    return (
        <div className={"flex flex-col gap-[4px]"} style={{width: width.width, maxWidth: width.maxWidth, minWidth: width.minWidth}}>
        <div className={`flex w-full p-12 gap-[8px] ${disabled && style.input_disabled} ${style.input_style} 
        ${status == 'error' ? style.border_red :
        status == 'success' ? style.border_success :
        ''
        }`}>
            <textarea onChange={changeEvent} ref={ref} type={type} name={name} placeholder={placeholder} className={`grow ${style.input} min-h-[80px]`} disabled={disabled} style={{resize: resize}}/>
        </div>
        {
            supportiveText && 
            <div className={`flex justify-between ${style.supportive_text} 
            ${status == 'error' ? style.text_danger : 
            status == 'success' ? style.text_success :
            ''
            }`}>
            <span>{supportiveText.title}</span>
            <span>{supportiveText.desc}</span>
            </div>
        }
        </div>
    )
}

export default TextArea;

TextArea.propTypes= {
    placeholder:PropTypes.string,
    type:PropTypes.oneOf(['text','number', 'email']),
    name:PropTypes.string,
    supportiveText: PropTypes.object,
    disabled: PropTypes.bool,
    status: PropTypes.oneOf(['success','error']),
    supportiveText: PropTypes.object,
    width: PropTypes.object,
    resize: PropTypes.string,
    maxLength: PropTypes.number,
}