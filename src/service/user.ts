import { get,post,put,del } from '@/utils/request';
import {ResType} from '@/utils/returnType'
 
 
export interface PeopleDTO {
    peopleId: string;
    peopleName: string;
    age: string;
    position: string;
    subordinate: PeopleV2DTO[];
}
 
export interface PeopleV2DTO {
    name: string;
    age: string;
}
 
export interface PeopleDTOList{
    uuid:string
}
 
export interface PeopleId{
    PeopleId: string;
}
export interface loginV2DTO {
    username: string;
    password: string;
    code:string;
    autoLogin:boolean;
    uuid:string
}

export interface registerV2DTO {
    username: string;
    password: string;
    confirmPassword:string;
    code:string;
    uuid:string
}

export interface opmV2DTO {
    opmName: string;
    describe:string;
    opmData:string;
}

export interface opmListV2DTO {
}
export const login:(
    params:loginV2DTO
) =>Promise<ResType<loginV2DTO>>=(params)=>{
    return post('/dev-api/login',params)
}
export const getUserInfo:(
) =>Promise<ResType<loginV2DTO>>=()=>{
    return get('/dev-api/system/user/profile')
}

export const getCaptchaImg:(
) =>Promise<ResType<PeopleDTOList>>=()=>{
    return get('/dev-api/captchaImage')
}

export const register:(
    params:registerV2DTO
) =>Promise<ResType<registerV2DTO>>=(params)=>{
    return post('/dev-api/register',params)
}

export const saveOpm:(
    params:opmV2DTO
) =>Promise<ResType<opmV2DTO>>=(params)=>{
    return post('/dev-api/system/opm_data',params)
}

export const editOpm:(
    params:opmV2DTO
) =>Promise<ResType<opmV2DTO>>=(params)=>{
    return put('/dev-api/system/opm_data',params)
}

export const opmList:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return get('/dev-api/system/opm_data/userList', { params }); 
}

export const getOpmData:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return get('/dev-api/system/opm_data/openOPM', { params }); 
}

export const opmCopy:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return get('/dev-api/system/opm_data/OpmCopy', { params }); 
}

export const markStar:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return post('/dev-api/system/opm_data/markStar?markStar='+params.markStar + '&opmId=' + params.opmId); 
}

export const historyOPM:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return get('/dev-api/system/opm_data/historyOPM', { params }); 
}

export const markStop:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return post('/dev-api/system/opm_data/markStop?markStop='+params.markStop + '&opmId=' + params.opmId); 
}

export const deleteOpm:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return del('/dev-api/system/opm_data/'+params); 
}

export const opmInfo:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return get('/dev-api/system/opm_data/getInfo', { params }); 
}

export const opmRecycle:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return get('/dev-api/system/opm_data/recycle', { params }); 
}

export const opmRestore:(
    params:any
) =>Promise<ResType<any>>=(params)=>{
    return get('/dev-api/system/opm_data/restore', { params }); 
}
