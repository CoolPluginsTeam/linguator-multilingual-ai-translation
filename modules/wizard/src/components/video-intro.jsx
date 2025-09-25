import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from '@bsf/force-ui'

const VideoIntro = ({ onGetStarted }) => {
  return (
    <div className="mx-auto max-w-[600px] p-10 min-h-[40vh] bg-white shadow-sm flex flex-col" style={{marginTop: "8px"}}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-text-primary mb-3">
          {__("Watch Setup Guide", "linguator-multilingual-ai-translation")}
        </h3>
        <p className="text-text-secondary mb-6">
          {__("Learn how to configure Linguator for your Multilingual Website", "linguator-multilingual-ai-translation")}
        </p>
      </div>
      
      <div className="relative w-full mb-6" style={{paddingBottom: '56.25%'}}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
          src="https://www.youtube.com/embed/VW2wKkJAo1c"
          title="Linguator Setup Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      
      <div className="flex justify-center pt-4">
        <Button onClick={onGetStarted} className="px-8 py-3">
          {__("Get Started", "linguator-multilingual-ai-translation")}
        </Button>
      </div>
    </div>
  )
}

export default VideoIntro
