"use client"

import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'
import TitleContainer from '@/container/TitleContainer/TitleContainer'
import { useRouter } from 'next/navigation'
import DatatableBO from '@/components/DatatableBO/DatatableBO'
import React,{useState} from 'react'
import { useDebounce,decodeHTML } from '@/libs/addOn'
import style from './MasterBrandContainer.module.scss'
import { ModalContext } from '@/constant/ModalContext'
import useSWR,{mutate} from 'swr'
import { useToken } from '@/store/zustand/token'
import { checkStatusLanguage, getDataTableSettingBahasa,saveChangedData } from '@/libs/masterBahasa.service'
import ToogleButton from '@/components/ToogleButton/ToogleButton'
import RadioButton from '@/components/Radio/RadioButton'
import Checkbox from '@/components/Checkbox/Checkbox'
import Bubble from '@/components/Bubble/Bubble'
import { useContext,useMemo,useEffect,useTransition } from 'react'

const dummyLanguages = [
  {code : 'en', name : 'English'},
  {code : 'fr', name : 'French'},
  {code : 'de', name : 'German'},

];

const dummyBrands = [
  {
    id:1,
      name: 'Brand A',
      image: 'https://via.placeholder.com/50',
      status: 'Active',
      translation: {
          en:'Brand A',
          fr:'Marque A',
          de:'Marke A'
      },
  },
  {
    id:2,
      name: 'Brand B',
      image: 'https://via.placeholder.com/50',
      status: 'Active',
      translation: {
          en:'Brand B',
          fr:'Marque B',
          de:'Marke B'
      },
  },
  {
    id:3,
      name: 'Brand C',
      image: 'https://via.placeholder.com/50',
      status: 'Active',
      translation: {
          en:'Brand C',
          fr:'Marque C',
          de:'Marke C'
      },
  },

];

const MasterBrandPage = (props) => {
  const router = useRouter();
  const [search,setSearch] = useState('');
  const {sidebar} = useContext(ModalContext)

  const handleAddClick = () => {
      router.push('/GM/master-brand/form?type=Tambah')
  }

  const handleClick = (item,type) => {
    router.push(`/GM/master-brand/form?type=${type}&code=${item.id}`)
  }

  const debounceHS = useDebounce((val) => {
      setSearch(val);
  },500)

  const handleSearch = (e) => {
    const value = e.target.value;
    debounceHS(value);
  }

  const clearSearch = () => {
    document.getElementById('pencarian').value = '';
    setSearch('');
  }
  const fetcher = (url) => fetch(url).then((res) => res.json());
  //const {data: languages, error} = useSWR(`${process.env.NEXT_PUBLIC_GLOBAL_API}all_bahasa`, fetcher)
  
  const {accessToken,clearToken} = useToken()
  const url = `${process.env.NEXT_PUBLIC_ALVIN_API}brand`
  const {data,isLoading,error}=useSWR([url,accessToken],([url,accessToken])=>getDataTableSettingBahasa(url,accessToken))
  
  const langColumns = dummyLanguages.map((lang)=>({
    label: 'Nama Brand ('+lang.code+')',
    field:`brandNameIn${lang.code}`,
  }));

    const columns = [
      { 
        label: 'Action',
        sortable:false,
        field:'action',
        editor: ({item}) => (
          <div className="flex flex-col gap-[5px]">
            <Button onClick={() => handleClick(item,'Detail')} Class="w-[87px] h-[32px] rounded-[20px] !bg-[#3ECD00] text-white">Detail</Button>
            <Button onClick={() => handleClick(item,'Edit')} Class="w-[87px] h-[32px] rounded-[20px] !bg-[#FFC217] text-white">Ubah</Button>
          </div>
        ) 
      },
      { label: 'Status', 
        sortable:false,
        field:'status',
        editor: ({item}) => (
          <div className="flex flex-col gap-[5px]">
            {item.status == 'active' ? (
              <>
                <span className="text-[#3ECD00]">Aktif</span>
              </>
            ) : (
              <span className="text-[#868686]">Nonaktif</span>
            )}
          </div>
        ) 
      },
      { 
        label: 'Icon',
        sortable:false,
        field:'icon',
        editor: ({item}) => (
          <div className="flex flex-col gap-[5px]">
              <img src={decodeHTML(item.imagePath)} alt="" className={`w-[60px] h-[60px] object-cover`}/>
          </div>
        ) 
      },
      { label: 'ID', field:'id' },

      ...langColumns,

    ];
 
  return (
    <div className={`${style.main} pt-[82px] ${sidebar?'ml-[298px]':'px-[18px]'} flex flex-col transition-all gap-[10px]`}>
      <TitleContainer title="Master Brand"/>
      <div className={`mt-[10px]`}>
        <div className={`flex justify-between items-center`}>
            <div className={`flex gap-[12px] items-center`}>
              <span className={`text-neutral-900`}>Pencarian : </span>
              <div className={`w-[232px] relative`}>
                <Input name='pencarian' id="pencarian" changeEvent={handleSearch} placeholder='Cari Nama Brand' maxLength='255'/>
                {
                  search.length > 0 && (
                    <img src="/svg/icon-close-search.svg" onClick={clearSearch} className={`absolute top-[11px] right-[9px]`} alt="" />
                  )
                }
              </div>
            </div>
            <Button color='primary' onClick={handleAddClick}>Tambah</Button>
        </div>

        <div className={`mt-[10px]`}>
          <DatatableBO 
            key="1"
            columns={columns} 
            search={search}
            apiUrl={`${process.env.NEXT_PUBLIC_GLOBAL_API}all_bahasa`} 
            paginate="10" 
          />
        </div>
      </div>
    </div>
  )
}

export default MasterBrandPage;
