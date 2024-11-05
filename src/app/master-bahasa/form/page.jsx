'use client'

import TitleContainer from '@/container/TitleContainer/TitleContainer'
import { useSearchParams } from 'next/navigation'
import style from './form.module.scss'
import React, {useState, useRef, useEffect } from 'react'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import ToogleButton from '@/components/ToogleButton/ToogleButton'
import Dropdown from '@/components/Dropdown/Dropdown'
import { getBahasaLocale,saveBahasa, getBahasaByID, updateBahasa } from '@/libs/masterBahasa.service'
import { objectToFormData, decodeHTML,formatDate, validateObject } from '@/libs/addOn'
import ModalBO from '@/components/ModalBO/ModalBO'
import { useToken } from '@/store/zustand/token'
import DatatableBO from '@/components/DatatableBO/DatatableBO'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import useFormMasterBahasa from '@/store/zustand/masterbahasa'


function FormMasterBahasaPage(){
  const uploadImageRef = useRef(null);
  const languageName = useRef(null)
  const urlSegment = useRef(null);
  const param = useSearchParams();
  const type = param.get('type');
  const title =  `${type} Bahasa`;
  const code = param.get('code')
  const {accessToken} = useToken()
  const {isFormChanged, showPopup, leavePage, setIsFormChanged, setShowPopup, setLeavePage} = useFormMasterBahasa();
  const router = useRouter();
  // State nggeh
  const [inputLanguageName, setInputLanguageName] = useState('');
  const [inputUrlSegment, setInputUrlSegment] = useState('');
  const [defaultValueDropdown, setDefaultValueDropdown] = useState({})
  const [imageSelected, setImageSelected] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [modalTrigger, setModalTrigger] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: 'Pemberitahuan',
    component: 'component',
  });
  const [getDataLocale, setGetDataLocale] = useState([])

  useEffect(()=> {
    if(showPopup){
      if(type === 'Tambah'){
        setModalContent((data) => ({
          ...data,
          title: 'Warning',
          component: SimpanModalElementAlert()
        }));
        setModalTrigger(true)
      }

    }
  }, [showPopup])

  // Use Effect
  useEffect(() => {
    if(accessToken){
      (async () => {
        try {
          const response = await getBahasaLocale(`bahasa_locale`, accessToken)
          const dataLocale = response?.Data.map((item) => ({
            name:item.text,
            value:{
              locale: item.locale,
              code: item.code
            }
          }))
          setGetDataLocale(dataLocale)

          if(type !== 'Tambah') {
            (async () => {
              try {
                const response = await getBahasaByID(`bahasa/${code}`, accessToken)
                const imageResponse = decodeHTML(response?.imagePath);
                setFormData({
                  locale: response?.locale,
                  code: response?.code,
                  name: response?.inputLanguageNameut,
                  url: response?.urlSegment,
                  image_path: null,
                  status: response?.status
                })
                setInputLanguageName(response?.name);
                setInputUrlSegment(response?.urlSegment);
                setImageSelected(imageResponse);
                setOldImage(imageResponse);
                setDefaultValueDropdown({
                  name:response?.name,
                  value:{
                    locale: response?.locale,
                    code: response?.code
                  }
                })
              } catch (error) {
                console.log('GetLocale : ', error.Message.Text)
              }
            })();
            
          } else {
      
            setFormData({
              locale: null,
              code: null,
              name: null,
              url: null,
              image_path: null,
              status: 'inactive'
            })
            
          }
          
        } catch (error) {
          console.log('getBahasaById : ', error.Message.Text)
        }
      })();

    }

  }, [accessToken,type])

  // Use Effect
  useEffect(() => {
    setFormData((data) => ({
      ...data,
      name: inputLanguageName,
      url: inputUrlSegment
    }))
  }, [inputLanguageName, inputUrlSegment])
  
  // Handle Change Image
  const handleChangeImage = (e) => {
    const file = e.target.files[0]
    setFormData((data) => ({
      ...data,
      image_path : file
    }))
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSelected(reader.result);
      setImageFile(file)
    }
    reader.readAsDataURL(file);
  }

  // Handle Change Language Name
  const changeLanguageName = (e) => {
    console.log(e.target.value)
    setInputLanguageName(e.target.value)
    setIsFormChanged(true)
  }

  // Handle Change Url Segment
  const changeUrlSegment = (e) => {
    console.log(e.target.value)

    setInputUrlSegment(e.target.value)
    setIsFormChanged(true)
  }

  // Delete Image
  const deleteImage = () => {
    setImageSelected(null);
    setImageFile(null)
    setFormData((data) => ({
      ...data,
      image_path : null
    }))
    setIsFormChanged(true)
  }

  // Toggle Active / Inactive
  const clickToggle = (item) => {
    setFormData((data) => ({
      ...data,
      status: item ? 'active' : 'inactive'
    }))
    setIsFormChanged(true)
  }

  // On Selected Dropdown
  const handleOnSelected = (item) => {
    setFormData((data) => ({
      ...data,
      locale: item[0].value.locale,
      code: item[0].value.code,
    }))
    setIsFormChanged(true)
  }

  // Trigger Save Click
  const saveClick = () => {
    setModalContent((data) => ({
      ...data,
      component: SimpanModalElement()
    }));
    setModalTrigger(true)
  }

  const triggerSaveClick = async () => {
    setModalTrigger(false)
    const validation = validateObject(formData);
    if(!validation){
      setModalContent((data) => ({
        ...data,
        component: AlertModalElement('Terdapat field yang kosong')
      }));
      setModalTrigger(!modalTrigger)
    } else {
      try {
        const body = objectToFormData(formData);
        const response = await saveBahasa('bahasa',body, accessToken)
        successSweet();
      } catch (error) {
        setModalContent((data) => ({
          ...data,
          component: AlertModalElement(error.Message.Text)
        }));
        setModalTrigger(true)
      }
    }
  }
  // Trigger Update Click
  const triggerUpdateClick = async () => {
    setModalTrigger(false)
    try {
      const body = objectToFormData(formData);
      body.append('old_image', oldImage);
      const response = await updateBahasa(`bahasa/${code}`,body, accessToken)
      successSweet();
    } catch (error) {
      setModalContent((data) => ({
        ...data,
        component: AlertModalElement(error.Message.Text)
      }));
      setModalTrigger(true)
    }
  }

  // Modal Syncronize Close
  const closeModalTrigger = (e) =>{
    setModalTrigger(e)
    setShowPopup(e)
  }

  const successSweet = () => {
    Swal.fire({
      text: 'Data Berhasil Disimpan',
      confirmButtonText: 'OK',
      icon: 'success',
      confirmButtonColor: '#3085D6'
    }).then((result) => {
      if(result.isConfirmed){
        router.push('/master-bahasa');
        setIsFormChanged(false)
        setShowPopup(false)
      }
    })
  }

  // Children Simpan Modal Element
  const SimpanModalElement = () => {
    return (
      <div className={`flex items-center justify-center flex-col`}>
        <h1 className={'text-neutral-900 text-[14px]'}>
          Apakah anda yakin akan menyimpan data ?
        </h1>
        <div className={`flex gap-[5px] mt-[24px]`}>
          <Button color='error_secondary' onClick={() => setModalTrigger(false)}>Batal</Button>
          <Button color='primary' onClick={type === 'Tambah' ? triggerSaveClick : triggerUpdateClick}>Simpan</Button>
        </div>
      </div>
    )
  }

  // Children Simpan Modal Element
  const SimpanModalElementAlert = () => {
    return (
      <div className={`flex items-center justify-center flex-col`}>
        <h1 className={'text-neutral-900 text-[14px]'}>
          Anda Belum Menyimpan Data
        </h1>
        <div className={`flex gap-[5px] mt-[24px]`}>
          <Button color='primary_secondary' onClick={leavePage}>Lanjutkan</Button>
          <Button color='primary' onClick={type === 'Tambah' ? triggerSaveClick : triggerUpdateClick}>Simpan</Button>
        </div>
      </div>
    )
  }

  // Children Simpan Modal Element
  const AlertModalElement = (text) => {
    return (
      <div className={`flex items-center justify-center flex-col`}>
        <h1 className={'text-neutral-900 text-[14px]'}>
          {text}
        </h1>
      </div>
    )
  }

  const column = [
    { 
      label: 'Last Update', 
      field:'updatedAt',editor:({item}) => (
        <>
          {formatDate(item.updatedAt)}
        </>
        ),
    },
    { label: 'Activity',  field:'activity' },
    { label: 'User Admin',  field:'userAdmin' },
    { label: 'Language Name', className:'w-[20%]', field:'name' },
    { label: 'Locale', className:'w-[20%]', field:'locale' },
    { label: 'Url',  field:'urlSegment' },
    { 
      label: 'Image',  
      field:'imagePath',
      editor:({item}) => (
        <div className="flex flex-col gap-[5px]">
            <img src={decodeHTML(item.imagePath)} alt="" className={`w-[60px] h-[60px] object-cover`}/>
        </div>
      ),
     },
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
    <TitleContainer title={title}/>
    <ModalBO isOpen={modalTrigger} onClose={closeModalTrigger} title={modalContent.title ? modalContent?.title : 'Pemberitahuan'}>
        {modalContent?.component}
    </ModalBO>
    <div className={`${style.container}`}>
      <form className={`flex flex-col gap-[10px]`} onSubmit={(e) => e.preventDefault()}>
          <div className={`flex items-center`}>
              <span className={`${style.form_label} ${style.required}`}>
                  Locale
              </span>
              <div className={`w-full`}>
                <Dropdown options={getDataLocale} defaultValue={type !== 'Tambah' && defaultValueDropdown} placeholder="Pilih Locale" disabled={type === 'Detail'} classname={`!w-full !border-neutral-600 ${type === 'Detail' && `!bg-neutral-200`} `} onSearchValue onSelected={handleOnSelected}/>
              </div>
          </div>
          <div className={`flex items-center`}>
              <span className={`${style.form_label} ${style.required}`}>
                  Language Name
              </span>
              <div className={`w-full`}>
                <Input name='language_name' ref={languageName} changeEvent={changeLanguageName} type='text' placeholder='Masukkan Language Name' maxLength='255' value={inputLanguageName} disabled={type === 'Detail'}/>
              </div>
          </div>
          <div className={`flex items-center`}>
              <span className={`${style.form_label} ${style.required}`}>
                  URL Segment
              </span>
              <div className={`w-full`}>
                <Input name='url_segment' ref={urlSegment} type='text' changeEvent={changeUrlSegment} placeholder='Masukkan URL Segment' maxLength='255' value={inputUrlSegment} disabled={type === 'Detail'}/>
              </div>
          </div>
          <div className={`flex items-center`}>
              <span className={`${style.form_label} ${style.required}`}>
                  Image
              </span>
              <div className={`w-full`}>
                {
                  imageSelected ? 
                  (
                    <div className={`relative w-fit`}>
                      <img src={imageSelected} alt='locale image' className={`${style.image_locale}`}/>
                      {
                        type !== 'Detail' && (
                          <img src='/svg/icon-close.svg' className={`absolute top-[2px] right-[2px] cursor-pointer`} onClick={deleteImage}/>
                        )
                      }
                    </div>
                  )
                  :
                  (
                    <>
                      <input type="file" ref={uploadImageRef} className={`hidden`} onChange={handleChangeImage} accept='.jpg,.jpeg,.png'/>
                      <Button color='primary_secondary' onClick={() => uploadImageRef.current.click()}>Unggah</Button>
                    </>

                  )
                }
              </div>
          </div>
          <div className={`flex items-center`}>
              <span className={`${style.form_label}`}>
                  Status
              </span>
              <div className={`w-full flex gap-[10px] items-center`}>
                <ToogleButton onClick={clickToggle} value={formData?.locale === 'active'} disabled={type === 'Detail'}/>
                <span className={`text-[14px] text-neutral-900 font-semibold`}>
                  Jika aktif maka akan tampil di Backoffice Setting Bahasa dan Backoffice lainnya
                </span>
              </div>
          </div>
          {type !== 'Detail' && (
            <div className={`flex justify-center mt-[10px]`}>
                  <Button color='primary' type='submit' onClick={saveClick}>Simpan</Button>
            </div>
          )}
      </form>
      
      <div className={`mt-[67px]`}>
        <h1 className={`text-neutral-950`}> Riwayat Perubahan</h1>
        <DatatableBO 
            key="1"
            columns={column} 
            parameter={{
              'id' : code || 0
            }}
            apiUrl={`${process.env.NEXT_PUBLIC_GLOBAL_API}riwayat_bahasa`} 
            paginate="10" 
          />
      </div>
    </div>
    </>
  )

}

export default FormMasterBahasaPage
