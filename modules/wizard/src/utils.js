import { __ } from '@wordpress/i18n';

  // Get nonce from localized script data
export const getNonce = () => {
  return window.lmat_setup?.nonce || '';
}

// Get language switcher options from localized data
export const languageSwitcherOptions = window.lmat_setup?.language_switcher_options || [];

