"use client"

import React, {useState,useEffect} from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Image from 'next/image';
import { useToken } from '@/store/zustand/token';
import Dropdown from '../Dropdown/Dropdown';
import style from './DatatableBO.module.scss'

const fetcher = (url,token) => axios.get(url,{
    headers: {
        Authorization: `Bearer ${token}`
    }
}).then(res => res.data);

/* 
1. prop column berfungsi untuk menaruh semua column field dalam bentuk array yang diingin kan contoh :
    [
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
    ]
        penjelasannya adalah untuk apabila penambahan design ditiap2 table tidak berbentuk text(html) maka gunakan/tambahkan objet editor seperti dicontoh, namun apa cuma text tidak perlu ditambahkan editor cukup label (untuk tulisan diheader), field (field key yang ada diapi), className(untuk tambahan class), sortable untuk sorting

2. apiUrl adalah url api yang akan diambil 
3. paginate adalah jumlah pagination yang dimunculkan
4. search adalah parameter untuk mengirim search
5. parameter berfungsi untuk penambahan paramter lainyya speerti untuk filter dll

        */

const DatatableBO = ({ columns, apiUrl,paginate="10",search = '',parameter = {}, filter = {}, showPaginate=false }) => {
    const {accessToken} = useToken();
    const [dataApi, setDataApi] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState(0)
    const [perPage,setPerPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [selectedrows,setSelectedrows] = useState([]);
    const [triggerSort, setTriggerSort] = useState(1);
    const [defaultPaginate, setDefaultPaginate] = useState({
        name:  paginate,
        value: paginate
    })

    const params = {
        page : currentPage,
        sort: sortField,
        order: sortOrder,
        page_size : defaultPaginate.value,
        q: search,
        ...filter,
        ...parameter
    };

    const paginateValue = [
        {
            name:  '10',
            value: '10'
        },
        {
            name:  '25',
            value: '25'
        },
        {
            name:  '50',
            value: '50'
        },
        {
            name:  '100',
            value: '100'
        },
    ]

    const queryString = new URLSearchParams(params).toString();
    const url = `${apiUrl}?${queryString}`
    console.log('URL',url)
    const {data,error,isLoading} = useSWR([url,accessToken],([url,accessToken]) => fetcher(url,accessToken));
    useEffect(() => {
        if(data) {
            fetchData();
        }
    }, [data]); 


    const fetchData = () => {
        try {
            setDataApi(data.Data);
            setPerPage(data.per_page);
            setTotalData(data.total);
            setCurrentPage(data.current_page);
            setLastPage(data.last_page);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // On Selected Dropdown
    const handleOnSelected = (item) => {
        setDefaultPaginate({
            name: item[0]?.name,
            value: item[0]?.value
        })
    }

    const handleSort = (field, value = '') => {
        // const order = sortOrder === 'asc' ? 'desc' : 'asc';

        setTriggerSort(triggerSort + 1)
        setSortField(field);

        if(triggerSort >= 3){
            setSortOrder('');
            setTriggerSort(1);
        } else {
            setSortOrder(value);
        }
    };

    const handlePageChange = (page) => {
        if (Number(page) >= 1 && Number(page) <= lastPage) {
            setCurrentPage(page);
        }
    };

    const handleSelectAll = () => {
        if(selectedrows.length === dataApi.length) {
            setSelectedrows([]);
        } else {
            setSelectedrows(dataApi.map(item => item.ID) )
        }
    }

    const handleSelectRow = (id) => {
        if(selectedrows.includes(id)) {
            setSelectedrows(selectedrows.filter(rowID => rowID != id ));
        } else {
            setSelectedrows([...selectedrows,id]);
        }
    }

    const isSelected = (id) => selectedrows.includes(id);

    const renderPagination = () => {
        const maxPagesToShow = 7;
        // ilham comenArray untuk menampung halaman yang akan ditampilkan
        let pages = [];
        // ilham Jika jumlah halaman lebih kecil atau sama dengan maxPagesToShow, tampilkan semua halaman
        if (lastPage <= maxPagesToShow) {
        for (let i = 1; i <= lastPage; i++) {
            pages.push(i);
        }
        } else {
            // ilham Jika halaman saat ini di awal
            if (Number(currentPage) <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(lastPage);
            }
            // Jika halaman saat ini di akhir
            else if (Number(currentPage) >= lastPage - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 4; i <= lastPage; i++) {
                    pages.push(i);
                }
            }
            // Jika halaman saat ini di tengah-tengah
            else {
                pages.push(1);
                pages.push('...');
                for (let i = Number(currentPage) - 1; i <= Number(currentPage) + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(lastPage);
            }
        }

        return (
        <div className={`flex justify-between items-center`}>
            {
                totalData > 0 ? (
                    <div className={`text-neutral-900 font-medium text-[14px]`}>
                        Menampilkan {totalData !== 0 ? '1' : '0'} - {dataApi ? dataApi.length : '0'} dari total {totalData} data pada kolom {lastPage === 0 ? '0' : currentPage} dari {lastPage} kolom
                    </div>
                ) :
                (
                    <div className={`text-neutral-900 font-medium text-[14px]`}>
                        Data tidak ditemukan
                    </div>
                )
            }
            <div className={`flex items-center gap-[5px]`}>
                {/* Select Paginate */}
                {
                    showPaginate && (
                        <>
                            <div className={`flex items-center gap-[5px] text-neutral-900 text-[14px]`}>
                                <div>
                                    Menampilkan
                                </div>
                                <div>
                                    <Dropdown onSearchValue={false} defaultValue={defaultPaginate} classname={`!w-[60px] ${style.limit}`} options={paginateValue} onSelected={handleOnSelected}/>
                                </div>
                                <div>
                                    data
                                </div>
                            </div>
                            <div>
                                |
                            </div>
                        </>
                    )
                }
                
                {/* Pagination */}
                <div className="pagination flex items-center">
                    <button onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 mx-1 bg-transparent text-[#868686] rotate-[180deg]">
                        <Image src='/svg/arrow-pagination.svg' width={20} height={20} alt="arrow prev"/>
                    </button>
                    {pages.length > 0 ? pages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            disabled={page == '...'}
                            className={`px-[10px] py-[4px] mx-1 ${
                            page == currentPage ? 'bg-primary-700 text-white' : 'text-[#868686]'
                            } text-[14px] font-bold rounded`}
                        >
                            {page}
                        </button>
                    )) : (
                        <button
                            key={1}
                            disabled
                            className={`px-[10px] py-[4px] mx-1 bg-primary-700 text-white
                            text-[14px] font-bold rounded`}
                        >
                            1
                        </button>
                    )}
                    <button onClick={() => handlePageChange(currentPage - (-1))} className="px-4 py-2 mx-1 bg-transparent text-[#868686]">
                        <Image src='/svg/arrow-pagination.svg' width={20} height={20} alt="arrow prev"/>
                    </button>
                </div>
            </div>
        </div>
        );
    };

    return (
        <div className="">
            <div className="border border-[#C6CBD4] rounded-lg p-[8px]">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`p-3 text-left text-sm font-medium text-neutral-600 text-[14px] cursor-pointer rounded-t-[20px] ${column.className || ''}`}
                                >
                                    {column.field == 'checked' ? (
                                        <div className={`flex gap-[5px] items-center`}>
                                            <input type="checkbox" 
                                                onChange={handleSelectAll}
                                                checked={selectedrows.length == dataApi.length && dataApi.length > 0}
                                            />
                                        </div>
                                    ) : (
                                        <div className={`flex gap-[5px] items-center`}>
                                            <span onClick={
                                            column.label != false ? () =>handleSort(column.field, sortOrder)
                                                : ()=>{}
                                            }>
                                                {column.label}
                                            </span>
                                            {column.sortable != false ? (
                                                <div className={`flex flex-col items-center`}>
                                                    <div className={`flex flex-col gap-[2px]`}>
                                                        <Image src='/svg/sorting-icon.svg' width={9} height={9} onClick={() => handleSort(column.field, 'asc')} className={`${sortOrder === 'asc' && sortField === column.field ? `opacity-0` : `opacity-100`}`} alt='icon desc'/>
                                                        <Image src='/svg/sorting-icon.svg' width={9} height={9} onClick={() => handleSort(column.field, 'desc')} alt='icon asc' className={`${sortOrder === 'desc' && sortField === column.field ? `opacity-0` : `opacity-100`} rotate-[-180deg]`}/>
                                                    </div>
                                                </div>
                                            ) : ''}
                                            
                                        </div>
                                    )}
                                    
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataApi?.length > 0 ? 
                                dataApi.map((item,index) => (
                                    <tr key={index} className="border-t border-gray-300 hover:bg-[#EBEBEB]">
                                        {columns.map((column, key) => {
                                            if(column.field == 'checked') {
                                                return (
                                                    <td key={column.field} className="p-3 text-sm text-gray-700">
                                                        <input type="checkbox" 
                                                            checked={isSelected(item.ID)}
                                                            onChange={() => handleSelectRow(item.ID)}
                                                        />
                                                    </td>
                                                )
                                            } else {
                                                const ElementCustom=column.editor
                                                return(
                                                    <td key={column.field} className="p-3 text-sm text-gray-700">
                                                        {column.editor ? <ElementCustom key={key} index={(currentPage - 1) * Number(perPage) + Number(index) + 1} item={item} /> : item[column.field] }
                                                    </td>
                                                )
                                            }
                                        })}
                                    </tr>
                                ))
                            :
                            (
                                <tr className="border-t border-gray-300 hover:bg-[#EBEBEB]">
                                    <td colSpan={columns.length} className={`text-center py-[10px]`}>
                                        <span className={` text-neutral-900 font-normal text-[12px]`}>Belum Ada Data</span>
                                    </td>
                                </tr>
                            )
                        }
                        
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                {renderPagination()}
            </div>
        </div>
    );
};

export default DatatableBO;