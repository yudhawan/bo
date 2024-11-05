'use client'
import React, { useState,useMemo, useContext } from 'react'
import style from './SideBarBackOffice.module.scss'
import IconComponent from '@/components/IconComponent/IconComponent'
import Image from 'next/image'
import Link from 'next/link'
import { ModalContext } from '@/constant/ModalContext'
import { useRouter,usePathname } from 'next/navigation'
import useFormMasterBahasa from '@/store/zustand/masterbahasa'

const SideBarBackOffice = ({menu}) => {
  const {sidebar} = useContext(ModalContext)  
  return (
    <div className={`fixed h-full bg-[#002064] ${sidebar ? `w-[280px]` : `w-[0px]`} z-10 transition-all `}>
      <div className={`bg-primary-700 py-[9px] pl-[28px] ${sidebar ? `block` : `hidden`}`}>
          <Image src="/svg/logo-muatmuat.svg" width={153} height={45} priority={false} alt='logo muatmuat'/>
      </div>
      <div className={`mt-[20px] ${sidebar ? `block` : `hidden`}`}>
          {menu.map((item,index) => (
            <MenuItem item={item} key={index} open={true}/>
          ))}
      </div>
    </div>
  )
}

const MenuItem = ({ item }) => { 
  const pathname=usePathname()
  const [open, setOpen] = useState(item.open);
  const {isFormChanged,setIsFormChanged, setShowPopup, setLeavePage} = useFormMasterBahasa();
  const router = useRouter();


  const rotateArrowSidebar = useMemo(() => {
    return open ? style.open : style.close;
  },[open])

  const handleClick = () => {
    setOpen(!open)
  }     
  return (
    <>
      {item.link ? (
        <>
          {
            isFormChanged ? (
              <>
              {item.icon ? ( 
                  <div onClick={ () => {
                      setShowPopup(true)
                      setLeavePage(()=>{
                        setIsFormChanged(false)
                        setShowPopup(false)
                        router.push(item.link+'/'+item.id)
                      })
                    }
                  }>
                    <div className={`text-neutral-50 select-none cursor-pointer text-[16px] hover:bg-[#033A76] font-[700] py-[10px] px-[12px] flex items-center `}>
                        <div className={`flex gap-[5px] items-center`}>
                          <IconComponent src={item.icon} width={16} height={16}/>
                          {item.title}
                        </div>
                    </div>
                  </div>
                ) : (
                  <div onClick={ () => {
                    setShowPopup(true)
                    setLeavePage(()=>{
                      setIsFormChanged(false)
                      setShowPopup(false)
                      router.push(item.link+'/'+item.id)
                    })
                  }
                }>
                    <div className={`text-neutral-50 cursor-pointer select-none text-[16px] hover:bg-[#033A76] font-[700] py-[10px] px-[12px] pl-[34px] flex items-center`}>
                        {item.title}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
              {item.icon ? ( 
                <Link href={item.link+'/'+item.id}>
                    <div className={`text-neutral-50 select-none cursor-pointer text-[16px] hover:bg-[#033A76] font-[700] py-[10px] px-[12px] flex items-center`}>
                        <div className={`flex gap-[5px] items-center`}>
                          <IconComponent src={item.icon} width={16} height={16}/>
                          {item.title}
                        </div>
                    </div>
                  </Link>
                ) : (
                  <Link href={item.link+'/'+item.id}>
                    <div className={`text-neutral-50 cursor-pointer select-none text-[16px] hover:bg-[#033A76] font-[700] py-[10px] px-[12px] pl-[34px] flex items-center`}>
                        {item.title}
                    </div>
                  </Link>
                )}
              </>
            )
            
          }
        </>
      ) : 
      (
        <div className={`flex flex-col`}>
            <div className={`text-neutral-50 cursor-pointer text-[16px] hover:bg-[#033A76] font-[700] py-[10px] px-[12px] flex items-center justify-between`} onClick={handleClick}>
                <div className={`flex gap-[5px] items-center`}>
                  <IconComponent src={item.icon} width={16} height={16}/>
                  <span>{item.title}</span>
                </div>
                <div className={`${rotateArrowSidebar} transition-all`}>
                  <IconComponent src='/icons/arrow-menu.svg' width={12} height={12}/>
                </div>
            </div>
            {open && (
                <div className={`flex flex-col`}>
                  {item.child.map((item, index) => (
                    <MenuItem item={item} key={index}/>
                  ))}
                </div>
            )}
          </div>
      )
      }
    </>
  )
}

export default SideBarBackOffice
