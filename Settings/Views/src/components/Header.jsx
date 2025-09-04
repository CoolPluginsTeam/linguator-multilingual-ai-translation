
import { Topbar } from '@bsf/force-ui';
import { __ } from '@wordpress/i18n';
import LinguatorIcon from '@linguator-icon.svg';
const Header = ({ setCurrentPage, currentPage }) => {
    const tabs = [{
        label: __("GENERAL", "linguator-multilingual-ai-translation"),
        value: "general"
    }
    ]
    return (
        <Topbar
            className="w-full min-h-[unset] h-16 shadow-sm p-0 relative z-[1] rounded-lg"
            gap={0}
        >
            <Topbar.Left className="p-5">
                <Topbar.Item className='flex items-center p-2'>
                <LinguatorIcon width="40" height="40" style={{ display: 'block' }} />
                </Topbar.Item>
            </Topbar.Left>
            <Topbar.Middle
                align="left"
                className="h-full"
            >
                <Topbar.Item className="h-full gap-4">
                    {
                        tabs.map((tab, index) => (
                            <a
                                className={`content-center no-underline h-full py-0 px-1 m-0 bg-transparent outline-none shadow-none border-0 focus:outline-none text-text-secondary text-sm font-medium cursor-pointer relative ${currentPage === tabs[index].value ? "active" : ''}`}
                                target="_self"
                                key={index}
                                onClick={() => {setCurrentPage(tab.value)}}
                            >
                                {tab.label}
                            </a>
                        ))
                    }
                </Topbar.Item>
            </Topbar.Middle>
            <Topbar.Right
                className="p-5"
                gap="md"
            >
                <Topbar.Item>
                    {/* <Button
                            className=""
                            iconPosition="left"
                            size="md"
                            tag="button"
                            type="button"
                            onClick={SaveSettings}
                            variant="primary"
                        >
                            Save Settings
                        </Button> */}
                </Topbar.Item>
            </Topbar.Right>
        </Topbar>
    )
}

export default Header