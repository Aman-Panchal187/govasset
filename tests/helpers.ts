import{expect,Page,APIRequestContext}from'@playwright/test';
export const accounts={admin:'admin@govasset.local',officer:'officer@govasset.local',verifier:'verifier@govasset.local',viewer:'viewer@govasset.local'};
export async function login(page:Page,email:string){await page.goto('/');await page.getByLabel('Email').fill(email);await page.getByLabel('Password').fill('Demo@123');await page.getByRole('button',{name:'Sign in'}).click();await expect(page.getByRole('link',{name:'Home',exact:true})).toBeVisible()}
export async function switchRole(page:Page,email:string){await page.evaluate(()=>localStorage.removeItem('govasset_token'));await login(page,email)}
export async function token(request:APIRequestContext,email:string){const r=await request.post('http://127.0.0.1:4000/api/auth/login',{data:{email,password:'Demo@123'}});expect(r.ok()).toBeTruthy();return(await r.json()).token as string}
export const headers=(token:string)=>({Authorization:`Bearer ${token}`});
