import {useState} from 'react'
import style from './LoginValidation.module.scss'

const LoginValidation = () => {
  return (
    <div className={style.main+' text-neutral-900'}>
      <span className="text-[14px] font-bold">Warning</span>
      <p className="text-[14px]">Email/Password tidak terdaftar</p>
    </div>
  )
}

export default LoginValidation
