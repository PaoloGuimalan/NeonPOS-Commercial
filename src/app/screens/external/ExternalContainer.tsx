import React from 'react';
import { Route, Routes } from 'react-router-dom';
import External from './screens/External';
import Receipt from './screens/Receipt';
import GenerateReport from './screens/GenerateReport';

function ExternalContainer() {
  return (
    <Routes>
        <Route path='/invoice' element={<External />} />
        <Route path='/receipt' element={<Receipt />} />
        <Route path='/generatereport' element={<GenerateReport />} />
    </Routes>
  )
}

export default ExternalContainer;