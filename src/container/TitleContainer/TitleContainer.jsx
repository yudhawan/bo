'use client'

import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'
import useFormMasterBahasa from '@/store/zustand/masterbahasa'

const TitleContainer = ({title,url}) => {
  const router = useRouter();
  const {isFormChanged,setIsFormChanged, setShowPopup, setLeavePage} = useFormMasterBahasa();
  const pathname = usePathname()
  const handleClickBack = () => {
    if(url){
      router.push(url)
      return;
    }
    if(pathname === '/master-bahasa/form'){
      if(isFormChanged){
        setShowPopup(true)
        setLeavePage(()=>{
          setIsFormChanged(false)
          setShowPopup(false)
          router.back()
        })
      } else {
        router.back();
      }
    } else {
      router.back();
    }
  }

  return (
    <div className={`flex gap-[5px] items-center`}> 
        <div className={`cursor-pointer`} onClick={handleClickBack}>
          <Image src='/svg/icon-back-bo.svg' width={24} height={24} alt="button back"/>
        </div>   
        <h1 className={`text-primary-700 font-bold text-[24px] select-none`}>
            {title}
        </h1>
    </div>
  )
}

export default TitleContainer
