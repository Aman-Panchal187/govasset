import{ReactNode,useEffect,useId,useRef,useState}from'react';
import{label}from'./api';

export function PageHeader({title,description,action,eyebrow}:{title:string;description?:string;action?:ReactNode;eyebrow?:string}){return <div className="page-intro"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description&&<p>{description}</p>}</div>{action&&<div className="page-actions">{action}</div>}</div>}

export function StatusBadge({value,kind='s',large}:{value:string;kind?:'s'|'c';large?:boolean}){return <span className={`badge ${large?'large':''} ${kind}-${value}`}><i aria-hidden="true"/>{label(value)}</span>}

export function Notice({type='info',title,children,onClose}:{type?:'info'|'success'|'error';title?:string;children:ReactNode;onClose?:()=>void}){return <div className={`notice ${type}`} role={type==='error'?'alert':'status'}>{title&&<b>{title}</b>}<span>{children}</span>{onClose&&<button aria-label="Dismiss message" onClick={onClose}>Dismiss</button>}</div>}

export function EmptyState({title,children}:{title:string;children?:ReactNode}){return <div className="empty-state"><h2>{title}</h2>{children&&<p>{children}</p>}</div>}

export function Field({label:text,hint,required,wide,error,children}:{label:string;hint?:string;required?:boolean;wide?:boolean;error?:string;children:ReactNode}){const id=useId();return <label className={`field ${wide?'wide':''} ${error?'has-error':''}`}><span>{text}{required?<em>Required</em>:<em className="optional">Optional</em>}</span>{children}{hint&&!error&&<small className="field-hint" id={`${id}-h`}>{hint}</small>}{error&&<small className="field-error-text" role="alert">{error}</small>}</label>}

/** Menu for secondary actions. Items are rendered by the caller. */
export function ActionMenu({buttonLabel='More actions',children}:{buttonLabel?:string;children:(close:()=>void)=>ReactNode}){const[open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null);useEffect(()=>{if(!open)return;const key=(e:KeyboardEvent)=>e.key==='Escape'&&setOpen(false);const click=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false)};document.addEventListener('keydown',key);document.addEventListener('mousedown',click);return()=>{document.removeEventListener('keydown',key);document.removeEventListener('mousedown',click)}},[open]);return <div className="action-menu-wrap" ref={ref}><button type="button" className="button subtle" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{buttonLabel} <span aria-hidden="true">▾</span></button>{open&&<div className="action-menu" role="menu">{children(()=>setOpen(false))}</div>}</div>}

/** Client-side required check that returns per-field messages. */
export function missing(values:any,fields:[string,string][]){const e:any={};for(const[k,name]of fields)if(!String(values[k]??'').trim())e[k]=`${name} is required.`;return e}
