import Image from 'next/image'
 const Loading = ()=>{ 
 return ( 
 <div className="fixed w-full h-full inset-0 flex justify-center items-center backdrop-blur-sm z-50 ">
    <Image src='/loading_animation.webp' width={200} height={200} alt='loading' />
 </div> 
 ) 
 }
 export default Loading