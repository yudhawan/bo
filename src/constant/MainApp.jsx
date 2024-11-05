'use client'
import React,{useEffect,useTransition} from 'react'
import ModalProvider from './ModalProvider'
import { usePathname } from 'next/navigation'
import ModalWindow from '@/container/ModalWindow/ModalWindow'
import ModalComponentsIndex from '@/ModalComponents'
import ClientApp from './ClientApp'
import { login } from '@/libs/auth.service'
import { useToken } from '@/store/zustand/token'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading/Loading'


function MainApp({children}) {
  const pathname = usePathname()
  const {setToken, accessToken} = useToken((state) => state);
  const param = useSearchParams();
  const router = useRouter();
  if(!accessToken && !pathname.split('/')[1]){
      const emailParams = param.get('email');
      const tokenParams = param.get('token');
      const urlParams = param.get('url');
      login(emailParams,tokenParams,(response) => {
        if(response.status == 200){
          setToken ({
            accessToken: response.data.Data.accessToken,
            refreshToken: response.data.Data.refreshToken
          })
          router.push(`/${urlParams}`)
        } else {
          console.error(response?.data?.Message.Text)
        }
      })
  }
  
  return (
      <ModalProvider>
        <main className="" >
          <ClientApp token={accessToken} pathname={pathname}>
            {children}
          </ClientApp>
        </main>
        {/* {pathname!=='/halamanOTP'&&<Footer />}  */}
        <ModalWindow>
          <ModalComponentsIndex/>
        </ModalWindow>
      </ModalProvider>
  )
}

export default MainApp
