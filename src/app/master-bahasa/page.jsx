"use client"

import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'
import TitleContainer from '@/container/TitleContainer/TitleContainer'
import { useRouter } from 'next/navigation'
import DatatableBO from '@/components/DatatableBO/DatatableBO';
import React,{useState} from 'react'
import { useDebounce,decodeHTML } from '@/libs/addOn';

function MasterBahasaPage(){
  const router = useRouter();
  const [search,setSearch] = useState('');

  const handleAddClick = () => {
      router.push('/master-bahasa/form?type=Tambah')
  }

  const handleClick = (item,type) => {
    router.push(`/master-bahasa/form?type=${type}&code=${item.id}`)
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
  
  const column = [
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
    { 
      label: 'Image',
      sortable:false,
      field:'image',
      editor: ({item}) => (
        <div className="flex flex-col gap-[5px]">
            <img src={decodeHTML(item.imagePath)} alt="" className={`w-[60px] h-[60px] object-cover`}/>
        </div>
      ) 
    },
    { label: 'Language Name', className:'w-[30%]', field:'name' },
    { label: 'Locale', className:'w-[20%]', field:'locale' },
    { label: 'Code', field:'code' },
    { label: 'URL', field:'urlSegment' },
    { label: 'Status', field:'status',
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
  ]

  return (
    <>
      <TitleContainer title="Master Bahasa"/>
      <div className={`mt-[10px]`}>
        <div className={`flex justify-between items-center`}>
            <div className={`flex gap-[12px] items-center`}>
              <span className={`text-neutral-900`}>Pencarian : </span>
              <div className={`w-[232px] relative`}>
                <Input name='pencarian' id="pencarian" changeEvent={handleSearch} placeholder='Cari Bahasa' maxLength='255'/>
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
            columns={column} 
            search={search}
            apiUrl={`${process.env.NEXT_PUBLIC_GLOBAL_API}all_bahasa`} 
            showPaginate={true} 
          />
        </div>
      </div>
    </>
  )
}

export default MasterBahasaPage;
