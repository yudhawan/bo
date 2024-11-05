'use client'
import React, { useContext } from 'react'
import style from './ModalWindow.module.scss'
import { ModalContext } from '../../constant/ModalContext'
function ModalWindow({children,classname}) {
  const {modalId,isLoading,closeArea,closeModal}=useContext(ModalContext)
    if(modalId!=='') return (
        <div className={`${classname} ${style.main}`} onClick={(e)=>{
          e.stopPropagation()
          if(closeArea){
            if(e.target===e.currentTarget&&!isLoading){
              closeModal()
            }
          }
        }}>
          {children}
        </div>
      )
  
}

export default ModalWindow
