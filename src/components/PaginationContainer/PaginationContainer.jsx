'use client'
import React, { memo, useMemo, useCallback } from 'react'
import PropTypes, { func } from 'prop-types'
import { useSearchParams } from 'next/navigation'
import {useRouter,usePathname} from 'next/navigation'
import * as Icon from '../../icons'
import IconComponent from '../../components/IconComponent/IconComponent'
import style from './PaginationContainer.module.scss'
const PaginationContainer = ({currentPage,offsite,totalPages,onPage,classname, clientSide=false, activeColor="red"}) => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const currPage = useMemo(()=>currentPage?currentPage:+params.get('page'),[params,currentPage])
  const generateThePages = useMemo(()=>{
    if(totalPages<=5){
      return Array.from({length:totalPages},(_,i)=>i+1)
    }
    let pagination=[]
    const countNum = 5
    const sideNum = 2
    const isAfter = currPage  < totalPages-4
    const isBefore = totalPages<=countNum?false:currPage - sideNum > 2
    if(currPage<=countNum&&totalPages<=countNum) return pagination=Array.from({length:totalPages},(_,i)=>i+1)
    else if(currPage<=countNum&&!(totalPages<=countNum)) pagination=Array.from({length:countNum},(_,i)=>i+1)
    else pagination.push(1)
    if(isBefore&&!(currPage<=countNum)) pagination.push('...')
    let startNumPage = currPage<=countNum?1:currPage>=totalPages-4?totalPages-4: Math.max(sideNum,currPage-sideNum)
    let endNumPage = currPage<=countNum?currPage:currPage>=totalPages-4?totalPages:Math.min(totalPages-1,currPage+1)
    for (let index = startNumPage; index <= endNumPage; index++) pagination.push(index)
    if(isAfter && !(currPage>=totalPages-4)) pagination.push('...')
    currPage>=totalPages-4?null:pagination.push(totalPages)
    const pg = [...new Set(pagination)]
    return currPage<=5?[...new Set(pagination)]:pagination
  },[currPage,currentPage,totalPages])

  const triggerPage = useCallback((p)=>{
    onPage(p)
    !clientSide&&router.push(pathname+`?page=${p}&page_size=${params.get('pageSize')}`)
  },[router])
  const activePage = activeColor=='primary'?style.active_blue:activeColor=='error'?style.active_red:style.active_gray
  return (
    <div className={`${style.main} ${classname}`}>
      {
        // totalPages>4&&
        <IconComponent src={Icon.ChevronLeftIcon} classname={`${style.Icon} ${+currPage==1?style.disableIcon:''}`} width={24} height={24} onclick={()=>{
          if(+currPage-1<1) triggerPage(1)
          else triggerPage(+currPage-1)
        }} />
      }
      
      {
        generateThePages.map((val,i)=>{
          return <span className={`text-neutral-600 select-none ${typeof val!=='string'&&style.list} ${+currPage===val?activePage:''} ${typeof val==='string'&&style.dots+' !cursor-default'}`} key={i} onClick={()=>triggerPage(val)} >
            {val}
          </span>
        })
      }
      {
        // totalPages>4&&
          <IconComponent src={Icon.ChevronRightIcon} width={24} height={24} classname={`${style.Icon} ${+currPage==totalPages?style.disableIcon:''}`} onclick={()=>{
            if(+currPage+1>totalPages) triggerPage(totalPages)
            else triggerPage(+currPage+1)}} />
      }
    </div>
  )
}

export default PaginationContainer

PaginationContainer.propTypes={
  classname:PropTypes.string,
  currentPage:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  totalPages:PropTypes.number.isRequired,
  onPage:PropTypes.func.isRequired,
  offsite:PropTypes.number.isRequired,
  clientSide:PropTypes.bool,
  activeColor:PropTypes.string
}