//This page is the main ruter from where which tab->Components is mapped
import React from 'react'
import General from './General'
import Sidebar from './Sidebar'
import apiFetch from "@wordpress/api-fetch"
import { getNonce } from '../utils'
import { LoaderPinwheel } from "lucide-react"
import { Loader } from "@bsf/force-ui"
import { sprintf,__ } from '@wordpress/i18n'
import TranslationConfig from './TranslationConfig'
//Component mapper for settings page
const ComponentSelector = ({currentPage,data, setData})=>{
  if(currentPage === 'general') return <General data={data} setData={setData} />
  if(currentPage === 'translation') return <TranslationConfig data={data} setData={setData} />
}


const MainComponent = ({ currentPage }) => {
  const [data, setData] = React.useState({}) //General Settings data
  const [loading, setLoading] = React.useState(true) //Loading state tracker
  React.useEffect(() => {
    async function serverCall() {
      //API call for getting general settings           
      const responseData = await apiFetch({
        path: 'lmat/v1/settings',
        method: 'GET',
        'headers': {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        }
      })
      setData(responseData)
      setLoading(false)



    }
    serverCall()
  }, [])

  return (
    <div className='md:flex gap-8'>
      <div className='md:w-[75%]'>
        {
          loading ?
            <div className='flex justify-center gap-4 items-center min-h-[100vh]'>
              <h1>
                <Loader
                  className=""
                  icon={<LoaderPinwheel className="animate-spin" />}
                  size="md"
                  variant="primary"
                /></h1> <h1 className='m-0'>{__("Loading", "linguator-multilingual-ai-translation")}</h1>
            </div> :
            <>
              <ComponentSelector currentPage={currentPage} data={data} setData={setData} />
            </>
        }

      </div>
      <div className='md:w-[25%] mt-4 w-full '>
        <Sidebar />
      </div>
    </div>
  )
}

export default MainComponent