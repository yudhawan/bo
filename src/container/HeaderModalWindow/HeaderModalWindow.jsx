'use client'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import style from './HeaderModalWindow.module.scss'
import { ModalContext } from '../../constant/ModalContext'

// classname berisikan style tailwind atau scss, rekomended(scss)
function HeaderModalWindow({classname,size='small'|'medium'|'large'}) {
    const {handleModalActive,handleModalId,withHeader,closeModal} = useContext(ModalContext) 
    const imgUrl =(size)=>{ 
      switch (size) {
        case 'small':
          return '/headerModalSmall.png'
        case 'medium':
          return '/headerModalMedium.png'
        case 'large':
          return '/headerModalBig.png'
        default:
          return '/headerModalMedium.png'
      }
    }
  return (
    <div className={`${classname} ${style.main} relative w-full`} onClick={e=>e.stopPropagation()}>
        {withHeader?<Image src={imgUrl(size)} width={385} height={70} alt='header' priority  className='w-full h-[70px]'  style={{objectFit:'fill'}} />:''}
        <button className='absolute right-2 top-2 cursor-pointer' onClick={()=>{
            closeModal()
        }}>
            <Image src={'	https://internal.assetlogistik.com/_resources/themes/muat/image/Subscription/close.svg'} width={20} height={20} alt='close' />
        </button>
    </div>
  )
}

export default HeaderModalWindow
