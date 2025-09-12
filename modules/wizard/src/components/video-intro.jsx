import React from 'react'
import { Play } from 'lucide-react'
import { __ } from '@wordpress/i18n'
import { Button } from '@bsf/force-ui'

const VideoIntro = ({ onGetStarted }) => {
  return (
    <div className="mx-auto max-w-[600px] p-10 min-h-[40vh] bg-white shadow-sm flex flex-col" style={{marginTop: "8px"}}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary-dark transition-colors">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {__("Watch Setup Guide", "linguator-multilingual-ai-translation")}
          </h3>
          <p className="text-text-secondary mb-6">
            {__("Learn how to configure Linguator in just a few minutes", "linguator-multilingual-ai-translation")}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end pt-5">
        <Button onClick={onGetStarted}>
          {__("Get Started", "linguator-multilingual-ai-translation")}
        </Button>
      </div>
    </div>
  )
}

export default VideoIntro
