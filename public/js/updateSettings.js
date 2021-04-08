
/*disable eslint*/
import axios from 'axios'
import { showAlert } from './alert'

//update data
export const updateSettings = async ( data, type ) => {
    const url = type === 'password' ?  '/api/v1/users/updatePassword' : '/api/v1/users/updateMe';
    try{
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        if(res.data.status === 'success') showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }catch(err){
        showAlert('error', err.response.data.message);
    }
}