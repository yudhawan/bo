import axios from 'axios';

export const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_GLOBAL_API,
})

api.interceptors.response.use(
    (response)=>{
        if(response?.status==401){
            requestToken().then(response=> localStorage.setItem('tokenGM',JSON.stringify({state:response})))
        }
        return response
    },
    async(error)=>{
        return Promise.reject(error)
    }
)
export const getColumnBahasa =(url, token) => fetch(url,{
    method:'get',
    headers: {
        'Authorization' : `Bearer ${token}`
    },
}).then(a=> a.json())
export const getDataTableSettingBahasa =(url, token) => fetch(url,{
        method:'get',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
    }).then(a=> a.json()).catch(err=>{
        if(err.response.status==401) {
            requestToken().then(response=> localStorage.setItem('tokenGM',JSON.stringify({state:response})))
            window.location.href='/GM'
        }
    })
export const checkStatusLanguage =(url) => fetch(url,{
        method:'get',
    }).then(a=> a.json())
export const saveChangedData =async (data, token,mutate,url) => {
    const response = await api('setting_bahasa',{
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
export const getBahasaLocale = async (url, token) => {
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

export const getBahasaByID = async (url, token) => {
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


export const saveBahasa = async (url, body, token) => {
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

export const updateBahasa = async (url, body, token) => {
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

export const requestToken = async()=>{
    let tok=JSON.parse(localStorage.getItem('tokenGM'))|{}
    console.log(tok)
    return api.post("auth/request-token",{
        refresToken:tok?.state?.refresToken
    }).then(a=>a.json()).catch(err=>{
        localStorage.removeItem('tokenGM')
        router.push('/GM')
    })
}