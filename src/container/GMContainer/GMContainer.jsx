'use client'
import { useContext,useMemo,useState,useEffect,useTransition,memo } from 'react'
import TitleContainer from '../TitleContainer/TitleContainer'
import { ModalContext } from '@/constant/ModalContext'
import Button from '@/components/Button/Button'
import useSWR from 'swr'
import { useTokenGM } from '@/store/zustand/token'
import { checkStatusLanguage, getDataTableSettingBahasa,saveChangedData } from '@/libs/masterBahasa.service'
import ToogleButton from '@/components/ToogleButton/ToogleButton'
import RadioButton from '@/components/Radio/RadioButton'
import Checkbox from '@/components/Checkbox/Checkbox'
import Bubble from '@/components/Bubble/Bubble'
import style from './GMContainer.module.scss'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import settingBahasaStore from '@/store/zustand/settingBahasa'
import PaginationContainer from '../../components/PaginationContainer/PaginationContainer'
import localPaginationStore from '@/store/zustand/pagination'
import Swal from 'sweetalert2'
import IconComponent from '@/components/IconComponent/IconComponent'
import Dropdown from '@/components/Dropdown/Dropdown'
import { useRouter } from 'next/navigation'

const tableHeader=['status','posisi','locale','language name','default penjual','penjual','default pembeli','pembeli']
const GMContainer = ()=>{ 
    const router = useRouter()
    const {data:dataPage,dataPagination,setData,currentPage,totalPages,setTotalPages,offset,setPage,search,setSearch,setOffsite} = localPaginationStore()
    const {accessToken,clearToken} = useTokenGM()
    const url = `${process.env.NEXT_PUBLIC_GLOBAL_API}/setting_bahasa?type=muatparts`
    const {data,isLoading,error}=useSWR([url,accessToken],([url,accessToken])=>getDataTableSettingBahasa(url,accessToken))
    const [rows,setRows] = useState([])
    const [getTmp,setTmp]=useState([])
    const [edit,setEdit]=useState(false)
    const {sidebar,handleModal,closeModal} = useContext(ModalContext)
    const {setCancelChange,setSubmitChange,cancelChange,submitChange} = settingBahasaStore()
    const [getTooltip,setTooltip]=useState('')
    const sensors = useSensors(
        useSensor(PointerSensor,{
            activationConstraint:{
                delay:200,
                tolerance:5
            }
        }),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    )
    const handleDragEnd = (event) => {
        const { active, over } = event
        if(!active || !over || active.id===over.id) return;
        setTmp((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            return arrayMove(items, oldIndex, newIndex)
        })
    }
    const handleChangeStatusTerrr=async(id,name,isSingular)=>{
        const getStat = JSON.parse(JSON.stringify(getTmp))?.find(a=>a.LanguageID===id)
        let newState = JSON.parse(JSON.stringify(getTmp))
        if(name==='Status' & !getStat[name]){
            let data = await checkStatusLanguage(`${process.env.NEXT_PUBLIC_GLOBAL_API}/status_bahasa?id=${id}`)
            newState.map(val=>{
                if(val.LanguageID===id) val[name]=data?.Data?.isActive
                if(!data?.Data?.isActive) val.disabled=true
                return val
            })
            // setValidation(prev=>([...prev,id]))
            setTmp(newState)
            closeModal()
            return;
        }
        if(name==='Status' & getStat[name]){
            newState.map(val=>{
                if(val.LanguageID===id) {
                    val['DefaultBuyer']=false
                    val['Buyer']=false
                    val['DefaultSeller']=false
                    val['Seller']=false
                    val[name]=false
                }
                return val
            })
            // setValidation(prev=>([...prev,id]))
            setTmp(newState)
            closeModal()
            return;
        }
        if(isSingular){
            let singular = newState.map(val=>{
                if(val.LanguageID===id) val[name]=isSingular
                else val[name]=false
                return val
            })
            newState=singular
        }else{
            newState.map(val=>{
                if(val.LanguageID===id && name==='Status' && typeof statDisable==='boolean') {
                    val[name]=statDisable
                }
                if(val.LanguageID===id) val[name]=!getStat[name]
                return val
            })
        }
        setTmp(newState)
    }
    const handleCancel = ()=>{
        if(JSON.stringify(rows)!==JSON.stringify(getTmp)){
            handleModal({
                modalId:'pemberitahuan',
                withHeader:false,
                isLoading:true,
                props:{
                    title:'Warning',
                    children:<>Anda belum menyimpan data!</>, 
                    buttonNoColor:'primary_secondary',
                    buttonNoText:'Lanjutkan',
                    buttonYesText:'Simpan',
                }
            })
            return
        }else submitCancel()
    }
    const submitSave = ()=>{
        closeModal()
        handleModal({
            modalId:'loading',
            withHeader:false,
            closeArea:false
        })
        let tmp = getTmp
        setEdit(false)
        saveChangedData(getTmp,accessToken).then(response=>{
            if(response?.Message?.Code==201){
                Swal.fire({
                    text: 'Data Berhasil Disimpan',
                    confirmButtonText: 'OK',
                    icon: 'success',
                    confirmButtonColor: '#3085D6'
                  }).then((result) => {
                    if(result.isConfirmed){
                        setData(tmp)
                        setRows(tmp)
                        setTotalPages(tmp.length)
                    }
                  })
                  setEdit(false)
                closeModal()
            }else{
                handleModal({
                    modalId:'pemberitahuan',
                    withHeader:false,
                    props:{
                        title:'Warning',
                        children:<>{response?.Data?.Message}</>,
                        hideButton:true
                    }
                })
                setEdit(true)
                setTmp(tmp)
            }
            // setSubmitChange(false)
        })
    }
    const submitCancel = ()=>{
        setTmp([])
        setEdit(false)
        closeModal()
        setCancelChange(false)
    }
    const handleSimpan = ()=>{
        handleModal({
            modalId:'pemberitahuan',
            withHeader:false,
            props:{
                children:<>Apakah anda yakin akan menyimpan data?</>, 
                buttonNoColor:'error_secondary',
                buttonNoText:'Batal',
                buttonYesText:'Simpan',
                manualClickYes:()=>submitSave(),
                manualClickNo:()=>submitCancel()
            }
        })
    }
    const RenderInEdit = useMemo(()=>{
        return <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        >
        <table className={`${style.table}`}>
            <thead>
            <tr className={style.tr}>
                {
                    tableHeader.map(val=> <th className={`${style.th}`} key={val}>{val}</th>)
                }
            </tr>
            </thead>
            <SortableContext items={getTmp} strategy={verticalListSortingStrategy}>
            <tbody>
                {getTmp?.map((val,i)=>{
                    val.id=i+1
                    return val
                }).map((row,i) => {
                    return(<>
                    
                <SortComponentItem key={row.id} id={row.id}>
                    <>
                        <td className={`${style.td}`}>
                            <div className='flex w-full justify-center relative'>
                                <div
                                onMouseEnter={()=>{
                                    if(row['disabled']) setTooltip(row['LanguageID'])
                                    else setTooltip(row['LanguageID'])
                                }} onMouseLeave={()=>setTooltip('')} onClick={()=>{
                                    if(!row['disabled']){
                                        handleModal({
                                            modalId:'pemberitahuan',
                                            withHeader:false,
                                            props:{
                                                children:<>Apakah anda yakin ingin {row['Status']?'menonaktifkan':'mengaktifkan'} Bahasa <b>{row['LanguageName']}?</b></>, 
                                            buttonNoColor:'error_secondary',
                                            buttonNoText:'Batal',
                                            buttonYesText:'Simpan',
                                            manualClickYes:()=>handleChangeStatusTerrr(row['LanguageID'],'Status'),
                                            manualClickNo:()=>{
                                                closeModal()
                                            }
                                            }
                                        })
                                    }
                                    
                                }} 
                                 >
                                    <ToogleButton value={row['Status']} disabled={!row['StatusMaster']} />
                                </div>
                                {
                                    (!row['StatusMaster']&&getTooltip===row['LanguageID'])&&<div className="absolute w-[248px] h-[70px] rounded-xl p-3 bg-white z-30 left-0 top-8 shadow-xl border border-neutral-200">
                                        <span className="relative w-full h-full text-xs font-normal text-[#1b1b1b]">
                                            Tidak bisa mengaktifkan Bahasa karena Nonaktif pada Master Bahasa
                                            <span className="w-4 h-4 rounded-sm -rotate-[135deg] absolute -top-5 left-1 border-r border-b border-neutral-200 bg-white -z-10    "></span>
                                        </span>
                                    </div>
                                }
                            </div>
                        </td>
                        <td className={`${style.td}`}>
                            <Bubble classname={`${style.bubleTerr} ${!edit?style.disabledBuble:''}`} >{i+1}</Bubble>
                        </td>
                        <td className={`${style.td}`}>{row?.Locale}</td>
                        <td className={`${style.td}`}>{row?.LanguageName}</td>
                        <td className={`${style.td}`}>
                            <div className='flex w-full justify-center'>
                                <div onClick={()=>{
                                    if(row['Status'] && row['StatusMaster']) handleChangeStatusTerrr(row['LanguageID'],'DefaultSeller',true)
                                }} className={`w-4 h-4 flex border border-neutral-600 rounded-full justify-center items-center ${(!row['Status']||!row['StatusMaster'])?'cursor-not-allowed':'cursor-pointer'}`}>
                                    {!!row['DefaultSeller']&&<span className={`bg-primary-700 rounded-full w-2 h-2`}></span>}
                                </div>
                            </div>
                        </td>
                        <td className={`${style.td}`}>
                            <div className='flex w-full justify-center'><Checkbox value={row['Seller']} onChange={()=>{
                                if(row['Status'] && row['StatusMaster']) handleChangeStatusTerrr(row['LanguageID'],'Seller')}} checked={row['Seller']} disabled={(!row['StatusMaster']||!row['Status'])}>
                                    <span className="flex-none"></span>
                                    </Checkbox>
                            </div>
                        </td>
                        <td className={`${style.td}`}>
                            <div className='flex w-full justify-center'>
                                <div onClick={()=>{
                                    if(row['Status'] && row['StatusMaster']) handleChangeStatusTerrr(row['LanguageID'],'DefaultBuyer',true)}} className={`w-4 h-4 flex border border-neutral-600 rounded-full justify-center items-center ${(!row['Status']||!row['StatusMaster'])?'cursor-not-allowed':'cursor-pointer'}`}>
                                    {!!row['DefaultBuyer']&&<span className={`bg-primary-700 rounded-full w-2 h-2`}></span>}
                                </div>
                            </div>
                        </td>
                        <td className={`${style.td}`}>
                            <div className='flex w-full justify-center'><Checkbox onChange={()=>{
                                if(row['Status'] &&row['StatusMaster']) handleChangeStatusTerrr(row['LanguageID'],'Buyer')}} checked={row['Buyer']} disabled={(!row['StatusMaster']||!row['Status'])} ><span className="flex-none"></span></Checkbox></div>
                        </td>
                    </>
                </SortComponentItem>
                </>)})}
            </tbody>
            </SortableContext>
        </table>
    </DndContext>
    },[getTmp,sensors,closestCenter,handleDragEnd,edit])
    useEffect(()=>{
        if(data?.Message?.Code==200) {
            setRows(data?.Data)
            setData(data?.Data)
            setTotalPages(data?.Data?.length)
        }
    },[data])
    useEffect(()=>{
        if(cancelChange) submitCancel()
        if(submitChange) handleSimpan()
    },[cancelChange,submitChange])
    useEffect(()=>{
        if(dataPagination.length>offset) setOffsite(offset)
    },[dataPagination])
    return ( 
        <div className={`${style.main} pt-[82px] ${sidebar?'ml-[298px]':'px-[18px]'} flex flex-col transition-all gap-[10px] pr-5`}>
            <TitleContainer title={'Setting Bahasa'} url={'/GM'} />
            <div className="w-full justify-between flex">
                <div className="w-fit justify-between gap-3 flex items-center">
                    <span>Pencarian : </span>
                    <div className='p-2 rounded-md border border-[#a8a8a8] w-[262px] flex items-center'>
                        <input className={'placeholder:text-[#868686] placeholder:text-xs w-full outline-none'} placeholder="Cari Bahasa" onChange={e=>{
                        if(e.target.value.length<255) setSearch(e.target.value)}} disabled={edit} value={search} />
                        {search?<span className='top-[10px] right-2 cursor-pointer' onClick={()=>setSearch('')}><IconComponent src={'/icons/silang.svg'} /></span>:''}
                    </div>
                </div>
            <div className="w-fit justify-between gap-[15px] flex">
                    {edit&&<Button type='primary' Class={style.buttonBatal} onClick={handleCancel}>Batal</Button>}
                    {edit&&<Button  type='primary' onClick={handleSimpan} disabled={JSON.stringify(rows)===JSON.stringify(getTmp)}>Simpan</Button>}
                    {(!edit)&&<Button onClick={()=>{
                        setEdit(true)
                        setTmp(rows)
                        setSearch('')
                        }} type='primary' Class={style.buttonUbah} disabled={!data?.Data?.length}>Ubah</Button>}
                </div>
            </div>
            {edit&&<span className='text-[12px]'>Pindahkan posisi dengan cara <b>drag and drop pada kolom posisi</b> untuk mengubah urutan bahasa</span>}
            {isLoading&&<>Loading...</>}
            {
                (!!getTmp.length&&edit)&&
                <div className="border border-[#c6cbd4] p-2 rounded-[10px]">
                    {RenderInEdit}
                </div>
            }
            {
                !edit?
                <div className="border border-[#c6cbd4] p-2 rounded-[10px]">
                    <table className={`${style.table}`}>
                        <thead>
                        <tr className={style.tr}>
                            {
                                tableHeader.map(val=> <th className={`${style.th}`} key={val}>{val}</th>)
                            }
                        </tr>
                        </thead>
                        <tbody >
                            {dataPagination?.length? dataPagination?.map((row,i) => {
                                let index = ((currentPage-1)*offset)+i
                                return(
                                <tr key={i}>
                                    <td className={`${style.td}`}><div className='flex w-full justify-center'><ToogleButton value={row['Status']} disabled={true} /></div></td>
                                    <td className={`${style.td}`}><Bubble classname={`${style.bubleTerr} ${style.disabledBuble}`} >{index+1}</Bubble></td>
                                    <td className={`${style.td}`}>{row?.Locale}</td>
                                    <td className={`${style.td}`}>{row?.LanguageName}</td>
                                    <td className={`${style.td}`}><div className='flex w-full justify-center'><RadioButton onChange={()=>handleChangeStatusTerrr(row?.LanguageID,'DefaultSeller',true)} checked={row['DefaultSeller']} value={row['DefaultSeller']} disabled={true} /></div></td>
                                    <td className={`${style.td}`}><div className='flex w-full justify-center'><Checkbox disabled={true} checked={row['Seller']} ><span className="flex-none"></span></Checkbox></div></td>
                                    <td className={`${style.td}`}><div className='flex w-full justify-center'><RadioButton disabled={true} onChange={()=>handleChangeStatusTerrr(row?.LanguageID,'DefaultBuyer',true)} checked={row['DefaultBuyer']} value={row['DefaultBuyer']} /></div></td>
                                    <td className={`${style.td}`}><div className='flex w-full justify-center'><Checkbox disabled={true} checked={row['Buyer']} ><span className="flex-none"></span></Checkbox></div></td>
                                </tr>
                            )}):<tr className="font-medium text-xs text-center py-6 text-[#1b1b1b]">
                                    <td colSpan='8' className='pt-2'> Tidak ada Data</td>
                                </tr>}
                        </tbody>
                    </table>
                </div>
                :''
            }
            <div className="flex w-full justify-between items-center">
                {(dataPage?.length&&!edit)?<span className='text-sm font-medium'>{dataPagination?.length?<>
                    Menampilkan 1 - {offset} dari total {totalPages} data pada kolom {currentPage} dari {offset} kolom
                </>:<span className='text-sm font-medium'>Data tidak ditemukan</span>
                    }
                </span>:""}
                {(dataPage?.length&&!edit)?
                <div className="flex ">
                    <div className='flex gap-[5px] items-center'>
                        <span>Menampilkan</span>
                        <Dropdown disabled={!dataPagination?.length} onSelected={val=>setOffsite(val?.[0]?.value)} classname={style.dropdown} options={[
                            {name:'10',value:10},
                            {name:'25',value:25},
                            {name:'50',value:50},
                            {name:'100',value:100},
                            ]} defaultValue={{name:offset.toString(),value:offset}} />
                        <span>data</span>
                        <span></span>
                    </div>
                    <PaginationContainer activeColor='primary' currentPage={currentPage} totalPages={totalPages} onPage={a=>setPage(a)} clientSide />
                </div>
                :''}
            </div>
        </div> 
    ) 
}
export default GMContainer
export function SortComponentItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
  
    return (
      <tr className={style.tr+' hover:bg-[#ebebeb] last:border-none'} ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={e=>e.preventDefault()}>
        {children}
      </tr>
    )
}

export const ToolTip= memo(function ToolTip({disabled}){
    const [show,setShow]=useState(disabled)
    setTimeout(()=>{},3000)
    if (show) {
        return <div className="absolute w-[248px] h-[70px] rounded-xl p-3 bg-white z-30 left-0 top-8 shadow-xl border border-neutral-200">
            <span className="relative w-full h-full text-xs font-normal text-[#1b1b1b]">
                Tidak bisa mengaktifkan Bahasa karena Nonaktif pada Master Bahasa
                <span className="w-4 h-4 rounded-sm -rotate-[135deg] absolute -top-5 left-1 border-r border-b border-neutral-200 bg-white -z-10    "></span>
            </span>
        </div>
        
    }
    return ''
})