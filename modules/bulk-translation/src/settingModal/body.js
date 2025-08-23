import Providers from "./providers.js";
import TranslateService from "../components/translateProvider/index.js";

const SettingModalBody = (props) => {
    const { prefix, localAiModalError } = props;
    const ServiceProviders = TranslateService();
    const openai_aiDisabled = !lmatBulkTranslationGlobal?.AIServices?.includes('openai');
    const google_aiDisabled = !lmatBulkTranslationGlobal?.AIServices?.includes('google');
    const openrouter_aiDisabled = !lmatBulkTranslationGlobal?.AIServices?.includes('openrouter');
    return (
        <div className={`${prefix}-setting-modal-body`}>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Translate</th>
                        <th>Docs</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(ServiceProviders).map((provider) => (
                        <Providers
                            key={provider}
                            {...props}
                            openai_aiDisabled={openai_aiDisabled}
                            google_aiDisabled={google_aiDisabled}
                            openrouter_aiDisabled={openrouter_aiDisabled}
                            localAiTranslatorDisabled={localAiModalError}
                            localAiModalError={localAiModalError}
                            openErrorModalHandler={props.errorModalHandler}
                            Service={provider}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SettingModalBody;
