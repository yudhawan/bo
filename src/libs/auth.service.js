import axios from 'axios';

export const doLogin = async(data)=>{
    try {
        const response = await axios(`${process.env.NEXT_PUBLIC_GLOBAL_API}auth/login/gm`,{
            method:'post',
            data:data
        })
        return response
        
    } catch (error) {
        return error
    }
}
export const login = async (email,token,callback) => {
    // let emailParams = 'kuronogenzo@gmail.com';
    // let tokenParams = 'd4f1cf04ec170dd0b035184b4f2cf2c9d66417c0';
    let emailParams = email;
    let tokenParams = token;
    
    const body = {
        email : emailParams,
        token : tokenParams
    }
    
    axios.post(`${process.env.NEXT_PUBLIC_GLOBAL_API}auth/login/admin`, body)
    .then((response) => {
        callback(response)
    }).catch((error) => {
        callback(error)
    })
}

export const logout = async (refreshToken,callback) => {
    const body = {
        refreshToken
    }
    axios.post(`${process.env.NEXT_PUBLIC_GLOBAL_API}auth/revoke-refresh-token`, body)
    .then((response) => {
        callback(response)
    }).catch((error) => {
        callback(error)
    })
}
