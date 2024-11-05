"use client"

import { ModalContext } from '@/constant/ModalContext'
import React, {useContext} from 'react'
import style from './LayoutContainer.module.scss'

const LayoutContainer = ({children}) => {
  const {sidebar} = useContext(ModalContext)
  return (
    <main className={` ${sidebar ? style.open : style.close} `}>
      {children}
    </main>
  )
}

export default LayoutContainer
