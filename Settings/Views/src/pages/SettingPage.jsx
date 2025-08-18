import React from 'react'
import Header from '../components/Header'
import MainComponent from '../components/MainComponent'
import { Toaster } from 'sonner'
const SettingPage = () => {
  const [currentPage,setCurrentPage] = React.useState('general');
  return (
    <div>
      <Toaster richColors position="top-right" />
      {/* header, topbar section */}
      <Header  setCurrentPage={setCurrentPage} currentPage={currentPage} />
      {/* main component -> tab switcher and main body */}
      <MainComponent currentPage={currentPage} />
    </div>
  )
}

export default SettingPage