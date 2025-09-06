import Providers from "./providers.js";
import TranslateService from "../components/translateProvider/index.js";

const SettingModalBody = (props) => {
    const { prefix, localAiModalError } = props;
    const ServiceProviders = TranslateService();
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
