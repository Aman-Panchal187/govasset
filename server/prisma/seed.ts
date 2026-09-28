import 'dotenv/config';
import { PrismaClient, LifecycleStatus, AssetCondition, AssetCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
const p=new PrismaClient();
const ids={admin:'user-admin',officer:'user-officer-health',verifier:'user-verifier-health',viewer:'user-viewer-health',health:'dept-health',education:'dept-education',adminDept:'dept-administration',pwd:'dept-pwd'};
async function main(){
  await p.activity.deleteMany();await p.attachment.deleteMany();await p.transfer.deleteMany();await p.disposal.deleteMany();await p.maintenance.deleteMany();await p.verification.deleteMany();await p.asset.deleteMany();await p.user.deleteMany();await p.location.deleteMany();await p.department.deleteMany();await p.counter.deleteMany();
  const departments=await Promise.all([
    p.department.create({data:{id:ids.health,name:'Health Department',code:'HLT'}}),p.department.create({data:{id:ids.education,name:'Education Department',code:'EDU'}}),p.department.create({data:{id:ids.adminDept,name:'Administration Department',code:'ADM'}}),p.department.create({data:{id:ids.pwd,name:'Public Works Department',code:'PWD'}})
  ]);
  const loc:any={};for(const [id,name,departmentId] of [['hospital','District Hospital',ids.health],['healthhq','Health Directorate',ids.health],['school','Central School',ids.education],['eduhq','Education HQ',ids.education],['collector','Collector Office',ids.adminDept],['store','Central Store',ids.adminDept],['pump4','Pump Station 4',ids.pwd],['workshop','PWD Workshop',ids.pwd]])loc[id]=await p.location.create({data:{id:`loc-${id}`,name,departmentId}});
  const hash=await bcrypt.hash('Demo@123',12);
  const users=await Promise.all([
    p.user.create({data:{id:ids.admin,name:'Anita Admin',email:'admin@govasset.local',passwordHash:hash,role:'SYSTEM_ADMIN'}}),
    p.user.create({data:{id:ids.officer,name:'Omkar Officer',email:'officer@govasset.local',passwordHash:hash,role:'ASSET_OFFICER',departmentId:ids.health}}),
    p.user.create({data:{id:ids.verifier,name:'Vijay Verifier',email:'verifier@govasset.local',passwordHash:hash,role:'FIELD_VERIFIER',departmentId:ids.health}}),
    p.user.create({data:{id:ids.viewer,name:'Asha Auditor',email:'viewer@govasset.local',passwordHash:hash,role:'VIEWER',departmentId:ids.health}}),
    p.user.create({data:{id:'officer-edu',name:'Esha Education Officer',email:'education.officer@govasset.local',passwordHash:hash,role:'ASSET_OFFICER',departmentId:ids.education}}),
    p.user.create({data:{id:'verifier-pwd',name:'Prakash Verifier',email:'pwd.verifier@govasset.local',passwordHash:hash,role:'FIELD_VERIFIER',departmentId:ids.pwd}})
  ]);
  const base={description:'Government property recorded in the departmental asset register',acquisitionSource:'NEW_RECEIPT' as const,acquisitionDate:new Date('2024-04-01'),purchaseReference:'PO/2024/001',acceptedById:ids.admin,acceptedAt:new Date('2024-04-03')};
  const create=async(code:string,name:string,category:AssetCategory,departmentId:string,locationId:string,condition:AssetCondition,status:LifecycleStatus,serial:string|null,officer:string|null,custodian:string,extra:any={})=>{const{cost,...fields}=extra;return p.asset.create({data:{...base,code,name,category,departmentId,locationId,condition,status,serialNumber:serial,assignedOfficerId:officer,custodianName:custodian,purchaseCost:cost||null,...fields}})};
  const a1=await create('GOV-2026-0001','Diesel Generator 125 kVA','EQUIPMENT',ids.health,loc.hospital.id,'DAMAGED','UNDER_MAINTENANCE','DG-HLT-001',ids.officer,'Hospital Engineering Unit',{cost:450000});
  const a2=await create('GOV-2026-0002','Advanced Life Support Ambulance','VEHICLE',ids.health,loc.hospital.id,'GOOD','ACTIVE','MH12AB1234',ids.officer,'Emergency Department',{cost:1800000});
  const a3=await create('GOV-2026-0003','Desktop Computer Set (20 units)','EQUIPMENT',ids.education,loc.school.id,'GOOD','ACTIVE','PC-EDU-1042','officer-edu','Computer Laboratory',{cost:1300000});
  const a4=await create('GOV-2026-0004','District Collectorate Building','BUILDING',ids.adminDept,loc.collector.id,'FAIR','ACTIVE',null,null,'District Administration',{acquisitionSource:'EXISTING_REGISTER',acquisitionDate:new Date('1998-06-15'),purchaseReference:'LAND-REG-88',cost:12000000});
  const a5=await create('GOV-2026-0005','Submersible Water Pump 15 HP','EQUIPMENT',ids.pwd,loc.pump4.id,'UNKNOWN','MISSING','PUMP-PWD-004',null,'Pump Station Supervisor',{cost:275000});
  const a6=await create('GOV-2026-0006','Portable Ultrasound Machine','EQUIPMENT',ids.health,loc.hospital.id,'GOOD','PENDING_ACCEPTANCE','US-HLT-2026',ids.officer,'Radiology Department',{acceptedById:null,acceptedAt:null,cost:950000});
  const a7=await create('GOV-2026-0007','Jeep Commander (2009)','VEHICLE',ids.health,loc.healthhq.id,'UNSERVICEABLE','DISPOSAL_PENDING','MH12CD0099',ids.officer,'Transport Section',{cost:600000});
  const a8=await create('GOV-2026-0008','Heavy-duty Photocopier','EQUIPMENT',ids.health,loc.healthhq.id,'UNSERVICEABLE','DISPOSED','COPY-HLT-11',ids.officer,'Records Section',{cost:120000});
  const a9=await create('GOV-2026-0009','Classroom Projector','EQUIPMENT',ids.education,loc.school.id,'FAIR','ACTIVE','PROJ-EDU-22','officer-edu','Assembly Hall',{cost:85000});
  const a10=await create('GOV-2026-0010','Road Roller 8 Tonne','VEHICLE',ids.pwd,loc.workshop.id,'GOOD','ACTIVE','RR-PWD-08',null,'Road Maintenance Division',{cost:3400000});
  await create('GOV-2026-0011','X-Ray Machine (Digital)','EQUIPMENT',ids.health,loc.hospital.id,'GOOD','ACTIVE','XR-HLT-2023',ids.officer,'Radiology Department',{cost:2200000});
  await create('GOV-2026-0012','Vaccine Cold Storage Unit','EQUIPMENT',ids.health,loc.healthhq.id,'FAIR','ACTIVE','CS-HLT-0412',ids.officer,'Immunisation Cell',{cost:340000});
  await create('GOV-2026-0013','Primary Health Centre Building','BUILDING',ids.health,loc.hospital.id,'FAIR','ACTIVE',null,ids.officer,'Medical Superintendent',{acquisitionSource:'EXISTING_REGISTER',acquisitionDate:new Date('2005-03-20'),purchaseReference:'PWD-HANDOVER-05',cost:8500000});
  await create('GOV-2026-0014','School Bus (52 seater)','VEHICLE',ids.education,loc.eduhq.id,'GOOD','ACTIVE','MH12EF5566','officer-edu','Transport In-charge',{cost:2100000});
  await create('GOV-2026-0015','Laptop for Field Verification','EQUIPMENT',ids.health,loc.healthhq.id,'GOOD','ACTIVE','LT-HLT-8891',ids.officer,'Vijay Verifier',{cost:72000});
  await p.verification.create({data:{assetId:a1.id,verifierId:ids.verifier,result:'FOUND',condition:'DAMAGED',actualLocationId:loc.hospital.id,remarks:'Fuel leak observed during inspection',createdAt:new Date('2026-08-10')}});
  await p.maintenance.create({data:{assetId:a1.id,issue:'Fuel leak in supply line',priority:'HIGH',notes:'Isolate generator pending repair',status:'IN_PROGRESS',createdById:ids.officer}});
  await p.verification.create({data:{assetId:a5.id,verifierId:'verifier-pwd',result:'MISSING',actualLocationId:loc.pump4.id,remarks:'Not found at designated bay; investigation opened',createdAt:new Date('2026-09-01')}});
  await p.disposal.create({data:{assetId:a7.id,reason:'Vehicle beyond economical repair',status:'PENDING',previousStatus:'ACTIVE',requestedById:ids.officer}});
  await p.disposal.create({data:{assetId:a8.id,reason:'Unserviceable and obsolete',status:'COMPLETED',previousStatus:'ACTIVE',requestedById:ids.officer,decisionById:ids.admin,decisionNote:'Approved by disposal committee',decidedAt:new Date('2026-07-01'),method:'SCRAP',completionDate:new Date('2026-07-15'),referenceNumber:'DISP/HLT/2026/07',completionNotes:'Handed to authorised recycler',completedById:ids.officer}});
  const acts=[[a1,'ASSET_ACCEPTED',{status:'ACTIVE'}],[a1,'ASSET_VERIFIED',{result:'FOUND',condition:'DAMAGED'}],[a1,'MAINTENANCE_OPENED',{issue:'Fuel leak in supply line'}],[a2,'ASSET_ACCEPTED',{status:'ACTIVE'}],[a3,'ASSET_ACCEPTED',{status:'ACTIVE'}],[a4,'ASSET_ACCEPTED',{status:'ACTIVE'}],[a5,'ASSET_REPORTED_MISSING',{remarks:'Investigation opened'}],[a6,'ASSET_REGISTERED',{status:'PENDING_ACCEPTANCE'}],[a7,'DISPOSAL_REQUESTED',{reason:'Vehicle beyond economical repair'}],[a8,'DISPOSAL_APPROVED',{note:'Approved by disposal committee'}],[a8,'DISPOSAL_COMPLETED',{method:'SCRAP',referenceNumber:'DISP/HLT/2026/07'}]] as const;
  for(const [a,action,details] of acts)await p.activity.create({data:{assetId:a.id,actorId:action.includes('ACCEPTED')||action.includes('APPROVED')?ids.admin:action.includes('VERIFIED')||action.includes('MISSING')? (a.id===a5.id?'verifier-pwd':ids.verifier):ids.officer,action,details}});
  await p.counter.create({data:{key:'assetCode',value:15}});
  console.log('Seeded GovAsset sample data (15 assets). Password for all demo users: Demo@123');
}
main().finally(()=>p.$disconnect());
