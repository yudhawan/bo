'use client'

import TitleContainer from '@/container/TitleContainer/TitleContainer'
import { useSearchParams } from 'next/navigation'
import style from './MasterBrandContainer.module.scss'
import React, {useContext, useState, useRef, useEffect } from 'react'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import ToogleButton from '@/components/ToogleButton/ToogleButton'
import Dropdown from '@/components/Dropdown/Dropdown'
import useSWR from 'swr';
import {getBahasaLocale} from '@/libs/masterBahasa.service'
import { getBrandLocale,saveBrand, getBrandByID, updateBrand, getAllBahasa } from '@/libs/masterBrand.service'
import { objectToFormData, decodeHTML,formatDate, validateObject } from '@/libs/addOn'
import ModalBO from '@/components/ModalBO/ModalBO'
import { useToken } from '@/store/zustand/token'
import DatatableBO from '@/components/DatatableBO/DatatableBO'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import useFormMasterBrand from '@/store/zustand/masterbrand'
import { ModalContext } from '@/constant/ModalContext'


const MasterBrandForm = () => {
  const uploadImageRef = useRef(null);
  const languageName = useRef(null)
  const param = useSearchParams();
  const type = param.get('type');
  const title =  `${type} Brand`;
  const code = param.get('code')
  const {accessToken} = useToken()
  const {isFormChanged, showPopup, leavePage, setIsFormChanged, setShowPopup, setLeavePage} = useFormMasterBrand();
  const router = useRouter();
  // State nggeh
  const [inputBrandNames, setInputBrandNames] = useState({});
  const [imageSelected, setImageSelected] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [formData, setFormData] = useState({
    brandNames:[],
    image_path:null
  });
  const [modalTrigger, setModalTrigger] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: 'Pemberitahuan',
    component: 'component',
  });
  const [getDataLocale, setGetDataLocale] = useState([])
  const [getLanguages, setGetLanguages] = useState([])
  const {sidebar} = useContext(ModalContext)
  
  const dummyLanguages = [
    {code : 'en', name : 'English'},
    {code : 'fr', name : 'French'},
    {code : 'de', name : 'German'},
  ];

  console.log(code)
  const handleBrandNameChange = (e, id) => {
    const {value} = e.target;
  
    setInputBrandNames((prev)=> ({
        ...prev,
        [id]:value,
    }))
    setIsFormChanged(true)

  }
  /*
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
*/
  // Use Effect
  useEffect(() => {
    console.log("url ",process.env.NEXT_PUBLIC_ALVIN_API+ `brand/${code}`)

    if(accessToken){

      // (async () => {
      //   try {
      //     const response = await getBahasaLocale(`bahasa_locale`, accessToken)
      //     const dataLocale = response?.Data.map((item) => ({
      //       name:item.text,
      //       value:{
      //         locale: item.locale,
      //         code: item.code
      //       }
      //     }))
      //     setGetDataLocale(dataLocale)
      //     console.log(type)
      //     if(type !== 'Tambah') {
      //       (async () => {
      //         try {
      //           const response = await getBrandByID(`brand/${code}`, accessToken)
      //           const imageResponse = decodeHTML(response?.imagePath);
      //           console.log("get data")
      //           setFormData({
      //             locale: response?.locale,
      //             code: response?.code,
      //             name: response?.name,
      //             url: response?.urlSegment,
      //             image_path: null,
      //             status: response?.status
      //           })
      //           setInputBrandNames(response?.name);
      //           setImageSelected(imageResponse);
      //           setOldImage(imageResponse);
      //         } catch (error) {
      //           console.log('GetLocale : ', error.Message.Text)
      //         }
      //       })();
            
      //     } else {
      
      //       setFormData({
      //         locale: null,
      //         code: null,
      //         name: null,
      //         url: null,
      //         image_path: null,
      //         status: 'inactive'
      //       })
            
      //     }
          
      //   } catch (error) {
      //     console.log('getBrandById : ' ,error)
      //   }
      // })();

      if(type !== 'Tambah') {
        (async () => {
          try {
            const response = await getBrandByID(`brand/${code}`, accessToken)
            const imageResponse = decodeHTML(response?.imagePath);
            console.log("get data")
            setFormData({
              locale: response?.locale,
              code: response?.code,
              name: response?.name,
              url: response?.urlSegment,
              image_path: null,
              status: response?.status
            })
            setInputBrandNames(response?.name);
            setImageSelected(imageResponse);
            setOldImage(imageResponse);
          } catch (error) {
            console.log('GetLocale : ', error.Message.Text)
          }
        })();
        
      } else {
  
        // setFormData({
        //   locale: null,
        //   code: null,
        //   name: null,
        //   url: null,
        //   image_path: null,
        //   status: 'inactive'
        // })
        
      }

    }

  }, [accessToken,type])



  // Use Effect Get Languages
  useEffect(() => {
    if(accessToken){
      console.log(accessToken)
      const fetchLanguages = async () => {
        try{
          const response = await getAllBahasa(`all_bahasa?page=1&page_size=10`, accessToken)
          if(response  && response.Data){
            const dataLanguages = response?.Data.map((item) => ({
              id:item.id,
              code:item.code.split("-")[0],
              value:{
                locale: item.id,
                code: item.code.split("-")[0]
              }
            }))
            setGetLanguages(dataLanguages)
          }else{
            console.error('Unexpected response structure', response)
          }
    
        }catch(error){
          console.error('error fetching languages', error);
        }
      };

      fetchLanguages();
      
    }else{
      console.log('access token is not avail')
    }
  },[accessToken])


  // Use Effect Create Data
  // useEffect(() => {
  //   const brandNamesArray = Object.entries(inputBrandNames).map(([code,brandName]) => ({
  //     languageId:code,
  //     brandName
  //   }));


  //   setFormData((data) => ({
  //     ...data,
  //     brandNames: brandNamesArray
  //   }));

  //   console.log('updated formdata',brandNamesArray);
  // }, [inputBrandNames])
  
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

  // Trigger Save Click
  const saveClick = () => {
    setModalContent((data) => ({
      ...data,
      component: SimpanModalElement()
    }));
    setModalTrigger(true)
  }

  const triggerSaveClick = async () => {
    console.log("submit ",formData)

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
        // const body = objectToFormData(formData);
        const body = new FormData();
        const brandNamesJson = JSON.stringify(formData.brandNames);
        body.append('brandNames', brandNamesJson);
          console.log(brandNamesJson)
        if(formData.image_path){
          body.append('image_path',formData.image_path);
        }
        if(formData.status){
          body.append('status',formData.status);
        }else{
          body.append('status','inactive');
        }
        const response = await saveBrand('brand',body, accessToken)
        successSweet();
      } catch (error) {
        setModalContent((data) => ({
          ...data,
          component: AlertModalElement('api not found')
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
      const response = await updateBrand(`brand/${code}`,body, accessToken)
      successSweet();
    } catch (error) {
      setModalContent((data) => ({
        ...data,
        component: AlertModalElement('test')
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
        router.push('/GM/master-brand');
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

  return (
    <div className={`${style.main} pt-[82px] ${sidebar?'ml-[298px]':'px-[18px]'} flex flex-col transition-all gap-[10px]`}>
        <TitleContainer title={title}/>
        <ModalBO isOpen={modalTrigger} onClose={closeModalTrigger} title={modalContent.title ? modalContent?.title : 'Pemberitahuan'}>
            {modalContent?.component}
        </ModalBO>
        <div className={`${style.container}`}>
        <form className={`flex flex-col gap-[10px]`} onSubmit={(e) => e.preventDefault()}>
            {getLanguages.map((lang) => (
                
            <div key={lang.code} className={`flex items-center`}>
                <span className={`${style.form_label} ${style.required}`}>
                    Nama Brand  ({lang.code})
                </span>
                <div className={`w-full`}>
                    <Input 
                        name={`brandName_${lang.code}`} 
                        changeEvent={(e)=>handleBrandNameChange(e,lang.id)}  
                        type='text' 
                        placeholder='Masukkan Language Name' 
                        maxLength='255' disabled={type === 'Detail'}/>
                </div>
            </div>


            ))}
            <div className={`flex items-center`}>
                <span className={`${style.form_label} ${style.required}`}>
                    Icon
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
                    
                </div>
            </div>
            {type !== 'Detail' && (
                <div className={`flex justify-center mt-[10px]`}>
                    <Button color='primary' type='submit' onClick={saveClick}>Simpan</Button>
                </div>
            )}
        </form>
        </div>
    </div>
  )

}

export default MasterBrandForm
