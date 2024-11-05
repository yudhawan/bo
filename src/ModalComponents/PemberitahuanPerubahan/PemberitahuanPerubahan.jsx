import React from 'react'
import style from './PemberitahuanPerubahan.module.scss'
import Button from '@/components/Button/Button'
import settingBahasaStore from '@/store/zustand/settingBahasa'
function PemberitahuanPerubahan({children,hideButton=false,buttonNoColor,buttonYesColor,buttonNoText,buttonYesText,title,manualClickYes,manualClickNo}) {
  const {setCancelChange,setSubmitChange,cancelChange,submitChange}=settingBahasaStore()
  return (
    <div className={style.main+' text-neutral-900'}>
        <span>{title?title:'Pemberitahuan'}</span>
        <span>{children}</span>
        {!hideButton?<div>
            <Button onClick={()=>typeof manualClickNo==="function"?manualClickNo():setCancelChange(!cancelChange)} color={`${buttonNoColor?buttonNoColor:'error_secondary'}`}>{buttonNoText?buttonNoText:'Batal'}</Button>
            <Button onClick={()=>typeof manualClickYes==="function"?manualClickYes():setSubmitChange(!submitChange)} color={`${buttonYesColor?buttonYesColor:'primary'}`}>{buttonYesText?buttonYesText:'Ya'}</Button>
        </div>:''}
    </div>
  )
}

export default PemberitahuanPerubahan
