import React from 'react'
import IconComponent from '../../components/IconComponent/IconComponent'
import * as Icons from '../../icons'
import style from './IconPageContainer.module.scss'

const IconPageContainer = () => {
  return (
    <div className='w-full flex flex-wrap gap-8'>
        <div className='w-full flex flex-col gap-2'>
            <span>Icon Primary</span>
            <div className='flex flex-wrap gap-2 border border-gray-100 rounded-sm p-4'>
                <IconComponent loader src={Icons.PlusIcon} title={'plus'} size={"large"}  />
                <IconComponent loader src={Icons.ChatIcon} title={'plus'} size={"large"}  />
                <IconComponent loader src={Icons.EditIcon} title={'chevron'} size={"large"}  />
                <IconComponent loader src={Icons.HomeIcon} title={'close'} size={"large"}  />
                <IconComponent loader src={Icons.LinkIcon} size={"large"} />
            </div>
        </div>
        <div className='w-full flex flex-col gap-2'>
            <span>Icon Secondary</span>
            <div className='flex flex-wrap gap-2 border border-gray-100 rounded-sm p-4'>
                <IconComponent loader src={Icons.PlusIcon} title={'plus'} color="secondary" size={"large"} />
                <IconComponent loader src={Icons.ChatIcon} title={'plus'} color="secondary" size={"large"}  />
                <IconComponent loader src={Icons.EditIcon} title={'chevron'} color="secondary" size={"large"}  />
                <IconComponent loader src={Icons.HomeIcon} title={'close'} color="secondary" size={"large"}  />
                <IconComponent loader src={Icons.LinkIcon} title={'search'} color="secondary" size={"large"}  />
            </div>
        </div>
       
        
    </div>
  )
}

export default IconPageContainer