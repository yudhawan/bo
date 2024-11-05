'use client'
import HeaderContainer from '@/container/HeaderContainer/HeaderContainer'
import React,{useEffect,useState,useTransition} from 'react'
import SideBarBackOffice from '@/container/SideBarBackOffice/SideBarBackOffice'
import { menuList, menuListGM } from '@/libs/MenuListBO'
import LoginContainer from '@/container/LoginContainer/LoginContainer'
import { interceptors, requestToken } from '@/libs/masterBahasa.service'
import { useRouter } from 'next/navigation'
import { useTokenGM } from '@/store/zustand/token'
import Loading from '@/components/Loading/Loading'

// interceptors.response.use(
//   (response)=>{
//     if(!response.request.responseURL.includes('/auth/request-token')&&!response.request.responseURL.includes('/login')){
//       return requestToken().then(response=> localStorage.setItem('tokenGM',response))
//     }
//   },
//   async(error)=>{
//     router.push('/GM')
//   }
// )

const ClientApp = ({children,token,pathname}) => {
  const [_,startTransition] = useTransition()
  const [isLoading,setIsLoading] = useState(true)
  const router = useRouter()
  const {accessToken:gmToken}=useTokenGM()
  useEffect(()=>{
    const reTrans = ()=>{
      startTransition(()=>{
        localStorage.getItem('tokenGM')
      })
      setIsLoading(false)
    }
    reTrans()
    return ()=>{}
  },[])
  if(isLoading) return <Loading/>
  return (
    <main>
      {(token||gmToken)?<SideBarBackOffice menu={pathname.split('/')[1]==='GM'?menuListGM:menuList}/>:''}
        <div>
            {token||gmToken?<HeaderContainer />:''}
            {(!gmToken ) && pathname.split('/')[1]==='GM'?<LoginContainer/>:children}
        </div>
    </main>
  )
}

export default ClientApp
