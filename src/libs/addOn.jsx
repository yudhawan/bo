"use client"
import react, {useCallback} from "react";

export const useDebounce = (callback, delay) => {
    const debouncedFn = useCallback(
      (...args) => {
        const handler = setTimeout(() => {
          callback(...args);
        }, delay);
  
        return () => {
          clearTimeout(handler);
        };
      },
      [callback, delay]
    );
  
    return debouncedFn;
}

export const objectToFormData = (obj) => {
  const dataForm = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    dataForm.append(key, value);
  })

  return dataForm;

}
// export const objectToFormMultipleData = (obj, form = new FormData(), namespace = '')=>{
  
//   Object.entries(obj).forEach(([key, value]) => {
//     dataForm.append(key, value);


//     const formKey = namespace ? `${namespace[${key}]}` : key;
//     if(typeof value === 'object' && value !== null && !(value instaceof File)){

//     }
//   })

//   return form;

// }
export const decodeHTML = (text) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}


export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


// Validate if have null object
export const validateObject = (obj) => {
  for (const key in obj) {
    if (obj[key] === null) {
      return false
    }
  }
  return true;
}