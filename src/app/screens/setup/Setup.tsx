import React, { useEffect, useState } from 'react';
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Startup from '../../reusables/Startup';
import Formtab from './tabs/Formtab';

function Setup() {

  const [isLoaded, setisLoaded] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
        setisLoaded(true);
    },10000);
  },[]);

  return (
    <div style={{ background: `url(${NeonPOSSVG})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className='w-full h-full absolute flex items-center justify-center bg-transparent'>
        <Routes>
            <Route path='/' element={isLoaded ? <Navigate to="/setup/form" /> : <Startup />} />
            <Route path='/form' element={isLoaded ? <Formtab /> : <Navigate to="/setup" />} />
        </Routes>
    </div>
  )
}

export default Setup;