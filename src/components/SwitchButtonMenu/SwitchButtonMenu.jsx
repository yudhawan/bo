import React, { createRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import style from './SwitchButtonMenu.module.scss'
const SwitchButtonMenu = ({buttons,type="primary",classname,defaultActiveValue,onClick=()=>{}}) => {
  const [isActive, setIsActive] = useState(
    typeof buttons[0]==="object"?buttons[0]['name']:buttons[0]
  )
  const [getIndexActive,setIndexActive]=useState()
  const [getPosition,setPosition]=useState(0)
  const [getRef,setRef]=useState([])
  const handleToogle=(i)=>{
    setIndexActive(i)
    setIsActive(getRef[i]?.current.textContent)
    setPosition((i*112)+(i*4))//width of button + gap 4px
  }
  useEffect(()=>{
    setRef(()=> Array(buttons.length).fill().map((_,i)=>getRef[i]||createRef()))
    const activeOn=defaultActiveValue?buttons.findIndex(val=>{
      if(typeof val==="object") return val.value===defaultActiveValue
      return val===defaultActiveValue
    }):0
    defaultActiveValue&&setIndexActive(activeOn)
  },[])
  useEffect(()=>{
    typeof getRef[getIndexActive]==='object'?getRef[getIndexActive].current.click():null
  },[getRef])
  return (
    <div className={`${style.main} ${style[type]} ${classname}`}>
      <span style={{transform:`translateX(${getPosition}px)`}} className={`${style.toogle} ${style[`button-active-${type}`]}`}>{isActive}</span>
      {
        buttons.map((val,i)=> {
        if(typeof val==="object"){
          return (<button onClick={()=>{
            handleToogle(i)
            onClick(val?.value)
          }} ref={getRef[i]} key={i} value={val?.value} className={`${style.defaultButton} ${style[`defaultColor-${type}`]}`}>{val?.name}</button>)
        }
        return (<button onClick={()=>{
          handleToogle(i)
          onClick(buttons[i])
        }} ref={getRef[i]} key={val} value={val} className={`${style.defaultButton} ${style[`defaultColor-${type}`]}`}>{val}</button>)})
      }
    </div>
  )
}

export default SwitchButtonMenu

SwitchButtonMenu.propTypes={
  buttons:PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.string)
  ]),
  type:PropTypes.oneOf(["primary","secondary"]).isRequired,
  onClick:PropTypes.func.isRequired,
  defaultActiveValue:PropTypes.string,
  classname:PropTypes.string,
}
