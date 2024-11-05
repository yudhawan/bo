"use client"
import React, { useState } from "react"
import { ModalContext } from "./ModalContext"

function ModalProvider({ children }) {
  const [sidebarTerr, setSidebarTerr] = useState(false)
  const [getModal,setModal] =useState({
    modalId:"",
    isLoading:false,
    withHeader:true,
    closeArea:true,
    hideCloseButton:false,
    sizeHeader:'small',
    props:null
  })
  const [getId,setId] =useState('')
  const handleId = val=> {
    setId(val)
  }
  const handleModal = ({
    modalId,
    isLoading,
    withHeader,
    closeArea,
    hideCloseButton,
    sizeHeader,
    props
  })=>{
    setModal(()=>({
      modalId:modalId?modalId:"",
      isLoading:typeof isLoading==='boolean'?isLoading:false,
      withHeader:typeof withHeader==='boolean'?withHeader:true,
      closeArea:typeof closeArea==='boolean'?closeArea:true,
      hideCloseButton:typeof hideCloseButton==='boolean'?hideCloseButton:false,
      sizeHeader:sizeHeader?sizeHeader:'small',
      props:props?props:null  
    }))
  }
  const closeModal=()=> {
    setModal({
      modalId:"",
      isLoading:false,
      withHeader:true,
      closeArea:true,
      hideCloseButton:false,
      sizeHeader:'small',
      props:null
    })
  }
  function handleSidebarTerr(val){
    setSidebarTerr(val)
  }
  return (
    <ModalContext.Provider
      value={{
        modalId:getModal.modalId,
        isLoading:getModal.isLoading,
        withHeader:getModal.withHeader,
        props:getModal.props,
        closeArea:getModal.closeArea,
        hideCloseButton:getModal.hideCloseButton,
        sizeHeader:getModal.sizeHeader,
        getId,
        sidebar:sidebarTerr,
        handleId,
        handleModal,
        closeModal,
        handleSidebar:handleSidebarTerr
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
