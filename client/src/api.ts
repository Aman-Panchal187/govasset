const BASE=import.meta.env.VITE_API_URL||'/api';
export const token=()=>localStorage.getItem('govasset_token');
export async function api(path:string,options:RequestInit={}){const headers:any={...(options.headers||{}),Authorization:`Bearer ${token()}`};if(options.body&&!(options.body instanceof FormData))headers['Content-Type']='application/json';const r=await fetch(`${BASE}${path}`,{...options,headers});if(!r.ok){const e=await r.json().catch(()=>({error:r.statusText}));throw new Error(e.error||'Request failed')}return r.status===204?null:r.json()}
export const post=(path:string,data:any)=>api(path,{method:'POST',body:JSON.stringify(data)});export const patch=(path:string,data:any)=>api(path,{method:'PATCH',body:JSON.stringify(data)});export const put=(path:string,data:any)=>api(path,{method:'PUT',body:JSON.stringify(data)});
export const money=(v:any)=>v==null?'—':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(Number(v));
export const date=(v:any)=>v?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium'}).format(new Date(v)):'—';
export const label=(v:string='')=>v.replaceAll('_',' ').toLowerCase().replace(/\b\w/g,(x:string)=>x.toUpperCase());
export async function downloadCsv(query=''){const r=await fetch(`${BASE}/export/assets.csv${query?`?${query}`:''}`,{headers:{Authorization:`Bearer ${token()}`}});if(!r.ok)throw new Error('Export failed');const url=URL.createObjectURL(await r.blob()),link=document.createElement('a');link.href=url;link.download='govasset-assets.csv';link.click();URL.revokeObjectURL(url)}
