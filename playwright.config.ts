import{defineConfig}from'@playwright/test';
export default defineConfig({testDir:'./tests',fullyParallel:false,workers:1,reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report'}]],use:{baseURL:'http://127.0.0.1:5173',headless:true,channel:'chrome',viewport:{width:1365,height:900},trace:'retain-on-failure',screenshot:'only-on-failure'},expect:{timeout:8000},timeout:120000});
