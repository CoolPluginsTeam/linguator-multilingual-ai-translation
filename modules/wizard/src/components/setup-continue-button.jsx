import { Button } from '@bsf/force-ui';
import { __ } from '@wordpress/i18n';
export default function SetupContinueButton({ SaveSettings,children="Continue" }) {
    return (
        <>
            <Button
                className="m-0 flex items-center"
                iconPosition="left"
                size="md"
                tag="button"
                type="button"
                onClick={SaveSettings}
                variant="primary"
                style={{minWidth:"100px"}}
            >
                {children}
            </Button>
        </>
    )
}
export const SetupBackButton = ({handleClick}) => {
    return (
        <>
            <Button
                className=""
                iconPosition="left"
                size="md"
                tag="button"
                type="button"
                onClick={handleClick}
                variant="primary"
            >
                {__('Back', 'linguator-multilingual-ai-translation')}
            </Button>
        </>
    )
}
