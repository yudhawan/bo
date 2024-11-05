import React from 'react'
import style from './HomeContainer.module.scss'
import Link from 'next/link'
const HomeContainer = () => {
  return (
    <div className={style.main}>
      <Link href="GM/setting-bahasa" className="bg-primary-700 text-white text-[20px] font-semibold rounded-[20px] p-[25px]">Backoffice GM Muatparts</Link>
    </div>
  )
}

export default HomeContainer
