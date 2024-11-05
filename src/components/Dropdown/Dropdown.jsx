import React, { useState, useRef, useEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'
import IconComponent from '../IconComponent/IconComponent'
import * as Icon from '../../icons'
import style from './Dropdown.module.scss'
const Dropdown = forwardRef(({ 
  options=[],
  classname,
  onSearchValue,
  onSelected=()=>{},
  selectedIconElement,
  placeholder='Select value',
  searchPlaceholder="Search...",
  showDropdown=false,
  isMultipleSelected=false,
  onCustom,
  textCustom,
  defaultValue,
  disabled = false
 },ref) => {
  const [isOpen, setIsOpen] = useState(showDropdown)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (option) => {
      if (selected.filter((item) => item.value == option.value).length) {
        if (isMultipleSelected) {
          const val = selected.filter((item) => item.value !== option.value)
          setSelected(val)
          onSelected(val)
        }else{
          setSelected([option])
          onSelected([option])
          setIsOpen(false)
          setSearch('')
        }
      }
      else {
        if(isMultipleSelected) {
          setSelected(prev=>[...prev, option])
          onSelected([...selected,option])
        }
        else {
          setSelected([option])
          onSelected([option])
          setIsOpen(false)
          setSearch('')
        }
      }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    onSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearch('')
  }
  const searchBy = options.filter((val) =>
    val?.name?.toLowerCase().includes(search.toLowerCase())
  )
  useEffect(()=>{
    if(defaultValue) setSelected([defaultValue])
  },[defaultValue])
  const labelName = selected.length?selected.map(val=> val?.name).join(', '):placeholder
  return (
    <div ref={dropdownRef} className={`${style.main} ${classname}`} >
      <button ref={ref} disabled={disabled} onClick={handleToggle} className={`${style.buttonPlace} ${!selected.length&&'!text-neutral-600'} select-none`}>
        {
          (isMultipleSelected && selected.length>1)?<span className='flex gap-[2px]' >
          {
            selected[0]?.name
          }
          <span className='bg-neutral-600 rounded-full text-neutral-50 px-1'>{selected.length-1}+</span>
          </span>: labelName
        }
        <IconComponent src={selectedIconElement??Icon.ChevronDownIcon} color='default' classname={`${style.chevron} ${isOpen?style.chevronRotate:''}`} />
      </button>
     
      {isOpen && (
        <div className={style.listContainer} >
          {onSearchValue&& <div className='h-[32px] border border-neutral-500 rounded flex items-center py-2 px-3 '>
            <IconComponent  src={'/icons/search.svg'} />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className={`w-full h-full outline-none focus:outline-none rounded py-2 px-3 text-[12px] flex-1 text-neutral-900 placeholder:text-neutral-700`} 
            />
            {search && <IconComponent src={'/icons/silang.svg'} onclick={e=>setSearch('')} />}
          </div>}
          {
            onCustom&&(
              <div className='flex  w-full justify-start items-center gap-2 border-b border-neutral-400 pb-3'>
                <IconComponent src={'/icons/Plus.svg'} width={14} height={14} onclick={onCustom} classname={style.customIcon} />
                <span className='text-neutral-900 font-[12px]'>{textCustom}</span>
              </div>
            )
          }
          <ul className={style.listOptions}>
            {searchBy.map((val, index) => (
              <li
                className={`${style.list} select-none`}
                key={index}
                onClick={() => handleSelect({value:val.value,name:val.name})}
              >
                <span className='flex flex-col'>
                  {val?.title&&<span className='font-[600] leading-[14px]'>{val?.title}</span>}
                  <span className='font-[500]'>{val?.name}</span>
                </span>
                {!!selected.filter(a=>a.value===val.value).length&& <IconComponent src={'/icons/check-circle.svg'} />}
              </li>
            ))}
            {searchBy.length === 0 && <li className='p-2 text-center text-[12px] select-none'>Data Tidak Ditemukan</li>}
          </ul>
        </div>
      )}
    </div>
  )
} )

export default Dropdown
Dropdown.propTypes={
  options:PropTypes.arrayOf(PropTypes.shape({
      name:PropTypes.oneOf([PropTypes.string,PropTypes.number]).isRequired,
      value:PropTypes.oneOf([PropTypes.string,PropTypes.number]).isRequired,
  })).isRequired,
  children: PropTypes.element,
  onSearchValue: PropTypes.func,
  selectedIconElement:PropTypes.element,
  searchPlaceholder:PropTypes.string,
  showDropdown:PropTypes.bool,
  getShowIndicator:PropTypes.func,
  placeholder:PropTypes.string,
  onSelected:PropTypes.func,
  isNotEmpty:PropTypes.bool,
  isMultipleSelected:PropTypes.bool,
  onCustom:PropTypes.func,
  textCustom:PropTypes.string,
  defaultValue:PropTypes.shape(PropTypes.object)
}