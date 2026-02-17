import {  toast } from 'sonner'

export const showSuccessMsg=(message)=>{
   toast.success(message)
} 
     
export const showErrorMsg=(message)=>{
    toast.error(message)
}

export const showWarningMsg=(message)=>{
    toast.warn(message)
}

export const showInfoMsg = (message) => {
    toast.info(message);
}