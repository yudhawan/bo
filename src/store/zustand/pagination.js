import { create } from "zustand";

const localPaginationStore = create((set) => ({
    data:[],
    search:'',
    dataPagination:[],
    offset:10,
    currentPage:1,
    totalPages:0,
    setData: val=>set(state=>({data:val,dataPagination:val?.slice(0,state.offset*state.currentPage)})),
    setPage:(val,offet)=>set((state)=>{
        let theOffsite = offet?offet:state.offset
        if(val>state.totalPages) return {currentPage:totalPages,dataPagination:state.data?.slice((state.totalPages-1)*theOffsite,theOffsite*state.totalPages)}
        if(val<1) return {currentPage:1,dataPagination:state.data?.slice(0,theOffsite)}
        return {
            currentPage:val,
            dataPagination:state.data?.slice((val-1)*theOffsite,val*theOffsite)
        }
    }),
    setTotalPages: (val,offsite)=>set(state=>{
        let theOffsite = offsite?offsite:state.offset
        return {totalPages:theOffsite>val?1:Math.ceil(val/theOffsite)}
    }),
    setSearch: val=>set((state)=>{
        let result=[]
        if(!val){
            result=state.data
            state?.setOffsite(state?.offset)
        }else{
            result = state.data?.filter(b=> b.Locale.toLowerCase().includes(val.toLowerCase()) || b.LanguageName.toLowerCase().includes(val.toLowerCase())).slice((state.currentPage-1)*state.offset,(state.currentPage-1)+state.offset)
            state.setTotalPages(result.length)
        }
        return {dataPagination:result,search:val?.trim()}
    }),
    setOffsite:val=>set(state=>{
        state?.setPage(val>state.totalPages?1:state?.currentPage,val)
        state?.setTotalPages(state.data.length,val)
        return {offset:val}
    })
}));

export default localPaginationStore;