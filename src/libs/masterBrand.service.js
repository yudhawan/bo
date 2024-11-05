import axios from 'axios';

const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_ALVIN_API,
})
const api2 = axios.create({
    baseURL:process.env.NEXT_PUBLIC_GLOBAL_API2,
})
export const getColumnBrand =(url, token) => fetch(url,{
    method:'get',
    headers: {
        'Authorization' : `Bearer ${token}`
    },
}).then(a=> a.json())
export const getDataTableSettingBrand =(url, token) => fetch(url,{
        method:'get',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
    }).then(a=> a.json())
export const checkStatusLanguage =(url) => fetch(url,{
        method:'get',
    }).then(a=> a.json())
export const saveChangedData =async (data, token,mutate,url) => {
    const response = await fetch(process.env.NEXT_PUBLIC_GLOBAL_API+'setting_brand',{
        method:'post',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            type:"muatparts",
            items:data
        })
    })
    const result = await response.json()
    if(result?.Message==200) {
        mutate(url)
        return result
    }
    else return result
}

export const getAllBahasa = async (url, token) => {
    try {
        const response = await api2.get(url, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getBrandLocale = async (url, token) => {
    try {
        const response = await api.get(url, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getBrandByID = async (url, token) => {
    try {
        const response = await api.get(url, {
            headers: {
                'Authorization' : `Bearer ${token}`
            } 
        })
        return response.data.Data;
    } catch (error) {
        throw error.response.data;
    }
}


export const saveBrand = async (url, body, token) => {
    try {
        const response = await api.post(url, body, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const updateBrand = async (url, body, token) => {
    try {
        const response = await api.put(url, body, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
