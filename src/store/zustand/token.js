import { create } from "zustand";
import {persist,createJSONStorage} from "zustand/middleware"

export const useToken = create(persist(
    (set) => ({
        accessToken: null,
        refreshToken: null,
        setToken: (tokens) => set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }),
        clearToken: () => {
            set({
                accessToken: null,
                refreshToken: null
            })
            localStorage.removeItem('token');
        }
    }),
    {
        name: 'token',
        getStorange: () => localStorage
    },
    
))

export const useTokenGM = create(persist(
    set=>({
        accessToken: null,
        refreshToken: null,
        setTokenGM: (tokens) => set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }),
        clearToken: () => {
            set({
                accessToken: null,
                refreshToken: null
            })
            localStorage.removeItem('tokenGM');
        }
    }),
    {
        name:'tokenGM',
        getStorange:()=> createJSONStorage(()=> localStorage)
    }
))