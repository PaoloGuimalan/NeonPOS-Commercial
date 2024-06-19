import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Startup from '../../reusables/Startup';
import Formtab from './tabs/Formtab';
import BGLayout from '../../reusables/BGLayout';

function Setup() {
  const [isLoaded, setisLoaded] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setisLoaded(true);
    }, 10000);
  }, []);

  return (
    <BGLayout className="absolute flex items-center justify-center bg-transparent">
      <Routes>
        <Route path="/" element={isLoaded ? <Navigate to="/setup/form" /> : <Startup />} />
        <Route path="/form" element={isLoaded ? <Formtab /> : <Navigate to="/setup" />} />
      </Routes>
    </BGLayout>
  );
}

export default Setup;
