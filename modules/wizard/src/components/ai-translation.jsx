import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Switch } from '@bsf/force-ui';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { setupContext } from '../pages/setup-page';
import SetupContinueButton, { SetupBackButton } from './setup-continue-button';
import { getNonce } from '../utils';

import { AnthropicIcon } from '../../../../assets/logo/anthropic';
import { ChromeIcon } from '../../../../assets/logo/chrome';
import { GeminiIcon } from '../../../../assets/logo/gemini';
import { GoogleIcon } from '../../../../assets/logo/google';
import { OpenAIIcon } from '../../../../assets/logo/openai';

const ChromeLocalAINotice = () => {
	const noticeType = useMemo(() => {
		const isHttps = window?.location?.protocol === 'https:';
		const isSecureContext = Boolean( window?.isSecureContext );

		const apiAvailable =
			( 'translation' in window?.self && 'createTranslator' in window?.self?.translation ) ||
			( 'ai' in window?.self && 'translator' in window?.self?.ai ) ||
			( 'Translator' in window?.self && 'create' in window?.self?.Translator );

		const hasChromeObject = Object.prototype.hasOwnProperty.call( window ?? {}, 'chrome' );
		const userAgent = navigator?.userAgent ?? '';
		const isChrome = hasChromeObject && userAgent.includes( 'Chrome' ) && ! userAgent.includes( 'Edg' );

		if ( ! isChrome ) {
			return 'browser';
		}

		if ( ! apiAvailable && ! isHttps && ! isSecureContext ) {
			return 'secure';
		}

		if ( ! apiAvailable ) {
			return 'api';
		}

		return null;
	}, [] );

	if ( ! noticeType ) {
		return null;
	}

	return (
		<div
			className="flex flex-col gap-4 p-6 rounded-lg"
			style={ { border: '1px solid #e5e7eb', background: '#fff5f5' } }
		>
			<div className="text-red-600 text-sm leading-6">
				<h3 className="font-semibold">
					{ noticeType === 'browser' && __( 'Important Notice: Browser Compatibility', 'linguator-multilingual-ai-translation' ) }
					{ noticeType === 'secure' && __( 'Important Notice: Secure Connection Required', 'linguator-multilingual-ai-translation' ) }
					{ noticeType === 'api' && __( 'Important Notice: API Availability', 'linguator-multilingual-ai-translation' ) }
				</h3>

				{ noticeType === 'browser' && (
					<ul className="list-disc ml-5 mt-2">
						<li>
							{ __( 'The Translator API (Chrome Local AI Models) is designed for the Chrome browser.', 'linguator-multilingual-ai-translation' ) }
						</li>
						<li>
							{ __(
								'If you are using a different browser (such as Edge, Firefox, or Safari), the API may not function correctly.',
								'linguator-multilingual-ai-translation'
							) }
						</li>
						<li>
							<a
								className="underline text-blue-600"
								href="https://developer.chrome.com/docs/ai/translator-api"
								rel="noreferrer noopener"
								target="_blank"
							>
								{ __( 'Learn more in the official documentation.', 'linguator-multilingual-ai-translation' ) }
							</a>
						</li>
					</ul>
				) }

				{ noticeType === 'secure' && (
					<>
						<ul className="list-disc ml-5 mt-2">
							<li>
								{ __( 'The Translator API requires a secure (HTTPS) connection to function properly.', 'linguator-multilingual-ai-translation' ) }
							</li>
							<li>{ __( 'If you are on an insecure connection (HTTP), the API will not work.', 'linguator-multilingual-ai-translation' ) }</li>
						</ul>

						<p className="mt-2">{ __( 'How to fix this:', 'linguator-multilingual-ai-translation' ) }</p>
						<ol className="list-decimal ml-5 mt-2">
							<li>
								{ __( 'Use a secure connection (https://).', 'linguator-multilingual-ai-translation' ) }
							</li>
							<li>
								{ __( 'Or add your site to Chrome’s “insecure origins treated as secure”.', 'linguator-multilingual-ai-translation' ) }{' '}
								<code>chrome://flags/#unsafely-treat-insecure-origin-as-secure</code>
							</li>
						</ol>
					</>
				) }

				{ noticeType === 'api' && (
					<>
						<ol className="list-decimal ml-5 mt-2">
							<li>
								{ __( 'Open this URL in a new Chrome tab:', 'linguator-multilingual-ai-translation' ) }{' '}
								<code>chrome://flags/#translation-api</code>
							</li>
							<li>
								{ __( 'Set “Experimental translation API” to Enabled.', 'linguator-multilingual-ai-translation' ) }
							</li>
							<li>
								{ __( 'Click Relaunch to apply changes.', 'linguator-multilingual-ai-translation' ) }
							</li>
							<li>
								{ __( 'The Translator AI option should now be enabled.', 'linguator-multilingual-ai-translation' ) }
							</li>
						</ol>
						<p className="mt-2">
							<a
								className="underline text-blue-600"
								href="https://developer.chrome.com/docs/ai/translator-api"
								rel="noreferrer noopener"
								target="_blank"
							>
								{ __( 'Documentation', 'linguator-multilingual-ai-translation' ) }
							</a>
						</p>
						<p>
							{ __( 'If the issue persists, please ensure Chrome is up to date and restart the browser.', 'linguator-multilingual-ai-translation' ) }
						</p>
						<p>
							<a
								className="underline text-blue-600"
								href="https://my.coolplugins.net/account/support-tickets/"
								rel="noreferrer noopener"
								target="_blank"
							>
								{ __( 'Open a support ticket', 'linguator-multilingual-ai-translation' ) }
							</a>
						</p>
					</>
				) }
			</div>
		</div>
	);
};

const AiTranslation = () => {
	const { setSetupProgress, data, setData } = useContext( setupContext );
	const aiTranslation = data?.ai_translation_configuration ?? {};
	const provider = aiTranslation?.provider ?? {};

	const wpAiClientAvailable = Boolean( window?.lmat_setup?.wp_ai_client_available );

	const [ googleMachineTranslation, setGoogleMachineTranslation ] = useState( Boolean( provider?.google ) );
	const [ chromeLocalAITranslation, setChromeLocalAITranslation ] = useState( Boolean( provider?.chrome_local_ai ) );
	const [ geminiTranslation, setGeminiTranslation ] = useState( Boolean( provider?.gemini ) );
	const [ openAITranslation, setOpenAITranslation ] = useState( Boolean( provider?.openai ) );
	const [ anthropicTranslation, setAnthropicTranslation ] = useState( Boolean( provider?.anthropic ) );

	const lastSavedRef = useRef( {
		chrome_local_ai: Boolean( provider?.chrome_local_ai ),
		google: Boolean( provider?.google ),
		gemini: Boolean( provider?.gemini ),
		openai: Boolean( provider?.openai ),
		anthropic: Boolean( provider?.anthropic ),
	} );

	useEffect( () => {
		setGoogleMachineTranslation( Boolean( provider?.google ) );
		setChromeLocalAITranslation( Boolean( provider?.chrome_local_ai ) );
		setGeminiTranslation( Boolean( provider?.gemini ) );
		setOpenAITranslation( Boolean( provider?.openai ) );
		setAnthropicTranslation( Boolean( provider?.anthropic ) );

		lastSavedRef.current = {
			chrome_local_ai: Boolean( provider?.chrome_local_ai ),
			google: Boolean( provider?.google ),
			gemini: Boolean( provider?.gemini ),
			openai: Boolean( provider?.openai ),
			anthropic: Boolean( provider?.anthropic ),
		};
	}, [ provider ] );

	const handleBack = () => {
		const mediaEnabled = window?.lmat_setup?.media === '1';

		if ( mediaEnabled ) {
			setSetupProgress( 'media' );
			localStorage.setItem( 'setupProgress', 'media' );
			return;
		}

		setSetupProgress( 'url' );
		localStorage.setItem( 'setupProgress', 'url' );
	};

	const saveAITranslation = async () => {
		try {
			const nextProvider = {
				chrome_local_ai: chromeLocalAITranslation,
				google: googleMachineTranslation,
				...( wpAiClientAvailable
					? {
							gemini: geminiTranslation,
							openai: openAITranslation,
							anthropic: anthropicTranslation,
						}
					: {} ),
			};

			const prevProvider = lastSavedRef.current ?? {};
			const hasChanges =
				prevProvider.google !== nextProvider.google ||
				prevProvider.chrome_local_ai !== nextProvider.chrome_local_ai ||
				( wpAiClientAvailable && prevProvider.gemini !== nextProvider.gemini ) ||
				( wpAiClientAvailable && prevProvider.openai !== nextProvider.openai ) ||
				( wpAiClientAvailable && prevProvider.anthropic !== nextProvider.anthropic );

			if ( hasChanges ) {
				const response = await apiFetch( {
					path: 'lmat/v1/settings',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': getNonce(),
					},
					body: JSON.stringify( {
						ai_translation_configuration: {
							provider: nextProvider,
						},
					} ),
				} );

				lastSavedRef.current = { ...nextProvider };
				setData( response );
			}

			setSetupProgress( 'language_switcher' );
			localStorage.setItem( 'setupProgress', 'language_switcher' );
		} catch ( error ) {
			toast.error( __( 'Please try again later', 'linguator-multilingual-ai-translation' ) );
		}
	};

	return (
		<div className="mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col">
			<div className="flex-grow">
				<h2>{ __( 'Translation Configuration', 'linguator-multilingual-ai-translation' ) }</h2>
				<p className="text-justify text-sm/6">
					{ __(
						'Linguator lets you translate content using AI. You can translate the content of your website using AI.',
						'linguator-multilingual-ai-translation'
					) }
				</p>
				<p className="text-justify text-sm/6">
					{ __(
						'Turn on AI translation if you need to translate the content of your website using AI. If not, you can leave it off.',
						'linguator-multilingual-ai-translation'
					) }
				</p>

				<div
					className="flex justify-between items-center p-6 rounded-lg"
					style={ { border: '1px solid #e5e7eb', marginBottom: '10px' } }
				>
					<div className="flex items-center gap-2">
						<GoogleIcon className="w-4 h-4" />
						<p className="text-sm/6">{ __( 'Google Machine Translation', 'linguator-multilingual-ai-translation' ) }</p>
					</div>
					<Switch
						aria-label={ __( 'Google Machine Translation', 'linguator-multilingual-ai-translation' ) }
						id="google-machine-translation"
						onChange={ () => setGoogleMachineTranslation( ( prev ) => ! prev ) }
						size="sm"
						value={ googleMachineTranslation }
					/>
				</div>

				<div className="p-6 rounded-lg" style={ { border: '1px solid #e5e7eb' } }>
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<ChromeIcon className="w-4 h-4" />
							<p className="text-sm/6">{ __( 'Chrome Local AI Translation', 'linguator-multilingual-ai-translation' ) }</p>
						</div>
						<Switch
							aria-label={ __( 'Chrome Local AI Translation', 'linguator-multilingual-ai-translation' ) }
							id="chrome-local-ai-translation"
							onChange={ () => setChromeLocalAITranslation( ( prev ) => ! prev ) }
							size="sm"
							value={ chromeLocalAITranslation }
						/>
					</div>
					{ chromeLocalAITranslation && <ChromeLocalAINotice /> }
				</div>

				{ wpAiClientAvailable && (
					<>
						<div
							className="flex justify-between items-center p-6 rounded-lg"
							style={ { border: '1px solid #e5e7eb', marginTop: '10px' } }
						>
							<div className="flex items-center gap-2">
								<GeminiIcon className="w-4 h-4" />
								<p className="text-sm/6">{ __( 'Gemini', 'linguator-multilingual-ai-translation' ) }</p>
							</div>
							<Switch
								aria-label={ __( 'Gemini', 'linguator-multilingual-ai-translation' ) }
								id="gemini-translation"
								onChange={ () => setGeminiTranslation( ( prev ) => ! prev ) }
								size="sm"
								value={ geminiTranslation }
							/>
						</div>

						<div
							className="flex justify-between items-center p-6 rounded-lg"
							style={ { border: '1px solid #e5e7eb', marginTop: '10px' } }
						>
							<div className="flex items-center gap-2">
								<OpenAIIcon className="w-4 h-4" />
								<p className="text-sm/6">{ __( 'OpenAI', 'linguator-multilingual-ai-translation' ) }</p>
							</div>
							<Switch
								aria-label={ __( 'OpenAI', 'linguator-multilingual-ai-translation' ) }
								id="openai-translation"
								onChange={ () => setOpenAITranslation( ( prev ) => ! prev ) }
								size="sm"
								value={ openAITranslation }
							/>
						</div>

						<div
							className="flex justify-between items-center p-6 rounded-lg"
							style={ { border: '1px solid #e5e7eb', marginTop: '10px' } }
						>
							<div className="flex items-center gap-2">
								<AnthropicIcon className="w-4 h-4" />
								<p className="text-sm/6">{ __( 'Anthropic', 'linguator-multilingual-ai-translation' ) }</p>
							</div>
							<Switch
								aria-label={ __( 'Anthropic', 'linguator-multilingual-ai-translation' ) }
								id="anthropic-translation"
								onChange={ () => setAnthropicTranslation( ( prev ) => ! prev ) }
								size="sm"
								value={ anthropicTranslation }
							/>
						</div>
					</>
				) }
			</div>

			<div className="flex justify-between" style={ { marginTop: '14px' } }>
				<SetupBackButton handleClick={ handleBack } />
				<SetupContinueButton SaveSettings={ saveAITranslation } />
			</div>
		</div>
	);
};

export default AiTranslation;