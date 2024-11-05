import React,{useContext} from 'react'
import { ModalContext } from '@/constant/ModalContext'
import IconComponent from '@/components/IconComponent/IconComponent'
import * as Icon from '../../icons'
import style from './HeaderContainer.module.scss'
import { useToken, useTokenGM } from '@/store/zustand/token'
import { logout } from '@/libs/auth.service'
import useFormMasterBahasa from '@/store/zustand/masterbahasa'
import { useRouter, usePathname } from 'next/navigation'

function HeaderContainer() {
  const router = useRouter()
  const {handleSidebar,sidebar} = useContext(ModalContext)
  const {setToken, accessToken,refreshToken, clearToken} = useToken((state) => state)
  const tokenGM = useTokenGM((state) => state)
  const {isFormChanged,setIsFormChanged, setShowPopup, setLeavePage} = useFormMasterBahasa();
  const pathname = usePathname()
  const handleLogout = () => {
    if(pathname === '/master-bahasa/form'){
      if(isFormChanged){
        setShowPopup(true)
        setLeavePage(()=>{
          setIsFormChanged(false)
          setShowPopup(false)
          logout(refreshToken,(response) => {
            if(response.status == 200){
              localStorage.removeItem('token');
              clearToken()
              window.location.href = `${process.env.NEXT_PUBLIC_BF_URL}adminlogin`
            }
          })
        })
      }else {
        logout(refreshToken,(response) => {
          if(response.status == 200){
            localStorage.removeItem('token');
            clearToken()
            window.location.href = `${process.env.NEXT_PUBLIC_BF_URL}adminlogin`
          }
        })
      }
    }else if(pathname.split('/')[1]==='GM'){
      return logout(tokenGM?.refreshToken,(response) => {
        if(response.status == 200){
          localStorage.removeItem('token');
          tokenGM?.clearToken()
          router.push(`/GM`)
        }
      })
    } else {
      logout(tokenGM?.refreshToken,(response) => {
        if(response.status == 200){
          localStorage.removeItem('token');
          tokenGM?.clearToken()
          router.push(`/GM`)
        }
      })
    }
    
  }

  const handleHome = () => {

    if(pathname === '/master-bahasa/form'){
      if(isFormChanged){
        setShowPopup(true)
        setLeavePage(()=>{
          setIsFormChanged(false)
          setShowPopup(false)
          window.location.href = `${process.env.NEXT_PUBLIC_BF_URL}adminmenu`
        })
      } else {
        window.location.href = `${process.env.NEXT_PUBLIC_BF_URL}adminmenu`
      }
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_BF_URL}adminmenu`
    }
  }
  return (
    <div className={`${sidebar ? style.main : style.close} transition-all`}>
      {(accessToken||tokenGM?.accessToken)?<span onClick={()=>handleSidebar(!sidebar)} className="bg-white rounded-[10px] p-[9px] w-[35px] h-[35px] grid grid-rows-2 grid-flow-col gap-[0.8px] cursor-pointer">
        <span className="bg-primary-700 w-[8px] h-[8px] rounded-sm"></span>
        <span className="bg-primary-700 w-[8px] h-[8px] rounded-sm"></span>
        <span className="bg-primary-700 w-[8px] h-[8px] rounded-sm"></span>
        <span className="bg-primary-700 w-[8px] h-[8px] rounded-sm"></span>
      </span>:<span className='w-[35px] h-[35px]'></span>}
      <div className="flex gap-5" >
        <span className="flex items-center gap-[5px] text-white cursor-pointer" onClick={handleHome}>
          <IconComponent src={Icon.HomeIcon} width={32} height={32} color='white'/>
          <p className='select-none'>Home</p>
        </span>
        <span className="flex items-center gap-[5px] text-white cursor-pointer" onClick={handleLogout}>
          <IconComponent src={Icon.LogOutIcon} width={32} height={32} color='white'/>
          <p className='select-none'>Logout</p>
        </span>
      </div>
    </div>
  )
}

export default HeaderContainer
