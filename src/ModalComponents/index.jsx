import React, { useContext } from 'react'
import style from './index.module.scss'
import { ModalContext } from '@/constant/ModalContext'
import { listModalComponents } from './serviceModal'
import HeaderModalWindow from '@/container/HeaderModalWindow/HeaderModalWindow'
function ModalComponentsIndex() {
  const {modalId,isLoading,headerSize,props} = useContext(ModalContext)
  const {id,component:Component} = listModalComponents.find(val=>val.id===modalId)
  return (
    <div className={`${style.main}`}>
      {(id===modalId)&&<HeaderModalWindow size={headerSize} />}
      {
        typeof Component==='function'?<Component {...props}/>:''
      }
    </div>
  )
}

export default ModalComponentsIndex