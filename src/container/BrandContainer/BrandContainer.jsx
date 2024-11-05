import React from 'react';
import { useTable } from 'react-table';


const dummyLanguages = [
    {code : 'en', name : 'English'},
    {code : 'fr', name : 'French'},
    {code : 'de', name : 'German'},

];

const dummyBrands = [
    {
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

const BrandContainer= () =>{
    const columns = React.useMemo(() => {
        const langCol = dummyLanguages.map((lang)=>({
            Header:lang.name,
            accessor:`brandNameIn${lang.code}`,
        }));


        return [
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell:({row}) => (
                    <div className= {`flex flex-col justify-center ${style.gapBtn}`}>

                        <Button type='primary' Class={style.buttonDetail} onClick={() => handleDetail(row.original)}>Detail</Button>
                        <Button type='primary' Class={style.buttonUbah} onClick={() => handleUbah(row.original)}>Ubah</Button>
                        
                    </div>
                )
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell:({row}) => (
                   <div>
                    {
                        cell.value === 'Active' ?
                        <ToogleButton onClick={()=>handleChangeStatusTerrr(row?.LanguageID,'Status')} value={row['Status']} disabled={true} /> :
                        <ToogleButton onClick={()=>handleChangeStatusTerrr(row?.LanguageID,'Status')} value={row['Status']} disabled={true} />

                    }

                   </div>
                )
            },
            {
                Header:'Icon',
                accessor: 'icon'
            },
            ...langCol,
        ]
    }, []);


    const data = React.useMemo(() => {
        return dummyBrands.map((brand) => ({
            action: null,
            status: brand.status,
            icon: brand.image,
            ...dummyLanguages.reduce((acc,lang) =>{
                acc[`brandNameIn${lang.code}`] = brand.translation[lang.code] || '';
                return acc;
            }, {})
        }))
    }, []);

    const handleDetail = (brand) =>{
        Swal.fire({
            title: 'Brand Details',
            text:`Detail for ${brand.name}`,
            icon: 'info',
            confirmButtonText:'Close'
        })
    }

    const handleUbah = (brand) =>{
        Swal.fire({
            title: 'Brand Ubah',
            text:`Detail for ${brand.name}`,
            icon: 'info',
            confirmButtonText:'Close'
        })
    }


    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
        columns,
        data
    });


    return (
        <table {...getTableProps()} className={`${style.table}`}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}

                    </tr>
                ))}
            </thead>
        </table>
    )
}

export default BrandContainer;