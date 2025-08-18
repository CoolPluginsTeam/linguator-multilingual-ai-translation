import { __ } from '@wordpress/i18n';

  // Get nonce from localized script data
export const getNonce = () => {
  return window.lmat_settings?.nonce || '';
}

export function fetchSelectedLanguage(){
  
}