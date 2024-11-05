import Image from 'next/image'
import {useState,useContext} from 'react'
import Input from '@/components/Input/Input'
import {EyeClosedIcon,EyeOpenIcon} from '@/icons'
import style from './LoginContainer.module.scss' 
import IconComponent from '@/components/IconComponent/IconComponent'
import { useForm } from 'react-hook-form'
import { ModalContext } from '@/constant/ModalContext'
import { doLogin } from '@/libs/auth.service'
import { useToken, useTokenGM } from '@/store/zustand/token'
import { useRouter } from 'next/navigation'
const LoginContainer = ()=>{ 
    const router = useRouter()
    const {
        register,
        handleSubmit,
    } = useForm()
    const {setTokenGM} = useTokenGM();
    const [showPas,setShowPas]=useState(false)
    const [validate,setValidate]=useState([])
    const {handleModal,closeModal} = useContext(ModalContext)
    const handleSubmitForm = async(form)=>{
        handleModal({
            modalId:'loading',
            withHeader:false,
            closeArea:false
        })
        const {data,status}=await doLogin(form)
        if(status!==200){
            closeModal()
            handleModal({
                modalId:'login_validation_error',
                withHeader:false,
            })
            return
        }
        if(Object.keys(data?.Data).length){
            setTokenGM(data?.Data)
            router.push('/GM')
        }
        closeModal()
    }
    const handleSubmitInvalid = (data)=> {
        let invalidFields = Object.keys(data).filter(field=>!data[field])
        setValidate(invalidFields.reduce((a,b)=>({...a,[b]:true}),{}))
    }
    const handleChange=(e,id)=>{
        let val = e.target.value
        setValidate(prev=>{
            let newValidate = {...prev}
            if(val) delete newValidate[id]
            else newValidate[id]=true            
            return newValidate
        })
    }
    return ( 
        <div className="bg-primary-500 w-full h-screen m-auto flex justify-center items-center">
            <form onSubmit={handleSubmit(handleSubmitForm,handleSubmitInvalid)} className="w-[569px] h-[397px] rounded-[20px] py-[40px] px-[32px] flex flex-col items-center gap-[39px] bg-white">
                <Image src="/muatmuatparts.svg" width={290} height={54} alt="logo" />
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-[#868686]">Email</span>
                    <Input classname={`${validate?.['email']?style.error:''}`} type="email" width="100%" placeholder="Email" {...register('email',{required:true})} changeEvent={(e)=>handleChange(e,'email')} />
                </div>
                <div className="flex flex-col gap-2 w-full relative" >
                    <span className="text-[#868686]">Password</span>
                    <Input classname={`${validate?.['password']?style.error:''}`} type={showPas?"text":"password"} placeholder="Password" {...register('password',{required:true})} changeEvent={(e)=>handleChange(e,'password')}  />
                    <span className={'absolute right-[10px] top-[40px] z-30'} onClick={(e)=>{
                            e.stopPropagation()
                            setShowPas(!showPas)
                        }}>
                        <IconComponent  src={showPas?EyeOpenIcon:EyeClosedIcon} width={20} height={20} loader={false} />

                    </span>
                </div>
                <button type='submit' className={style.button}>Masuk</button>
            </form>
        </div> 
    ) 
 }
 export default LoginContainer