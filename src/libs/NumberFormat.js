export const numberFormatMoney = (val)=>{
    const currency = new Intl.NumberFormat('id-ID',{
        style:'currency',
        currency:'IDR',
    }).format(val)
    return currency
}

export const thousandSeparator=(x)=> {
    const val= x.toLocaleString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")
    const lastIdx = val.lastIndexOf('.')
    const string = val.toString().slice(0,lastIdx) + ','+val.slice(lastIdx+1)
    return string
}