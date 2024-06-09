import React, { useEffect, useState } from 'react';
import ReusableModal from './ReusableModal';
import { motion } from 'framer-motion';
import NeonPOS from '../../assets/NeonPOS.png'
import NeonPOSSVG from '../../assets/NeonPOS_BG.svg'

function Startup() {

  const [easeIn, seteaseIn] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
        seteaseIn(true);
    },6000);
  },[]);

  return (
    <div style={{ background: `url(${NeonPOSSVG})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className='w-full h-full absolute flex items-center justify-center'>
        <ReusableModal shaded={false} padded={false} children={
            <motion.div
            initial={{
                maxHeight: "0px"
            }}
            animate={{
                maxHeight: easeIn ? "0px" : "600px"
            }}
            transition={{
                delay: easeIn ? 0 : 1,
                duration: easeIn ? 2 : 4,
                ease: "circInOut"
            }}
            className='w-[95%] h-[95%] max-w-[700px] rounded-[10px] overflow-y-hidden'>
                <div className='w-full h-full p-[20px] flex items-center justify-center'>
                    <img src={NeonPOS} className='h-[200px]' />
                </div>
            </motion.div>
        } />
    </div>
  )
}

export default Startup;