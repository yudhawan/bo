import React, {useState, useEffect} from 'react'
import style from './ModalBO.module.scss'
import Image from 'next/image'
const ModalBO = ({title, children, isOpen = false, onClose}) => {
  const [handleOpen, setHandleOpen] = useState(isOpen)

  useEffect(() => {
    setHandleOpen(isOpen)
  }, [isOpen])

  const handleCloseClick = () => {
    setHandleOpen(!handleOpen)
    return onClose(!handleOpen);
  }

  return (
    <div className={`${style.modal_overlay} ${handleOpen ? 'fixed' : 'hidden'} `}>
      <div className={`${style.modal_body}`}>
            <div className={`${style.modal_content}`}>
              <div className={`${style.modal_header}`}>
                <h1 className={`text-neutral-900 text-[14px] font-semibold w-[337px] text-center`}>{title}</h1>
                <Image src='/svg/close-modal.svg' alt='as' className={`cursor-pointer`} onClick={handleCloseClick} />
              </div>
              <div className={`${style.modal_children}`}>
                  {children}
              </div>
            </div>
      </div>
    </div>
  )
}

export default ModalBO
