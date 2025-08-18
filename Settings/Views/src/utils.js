import { __ } from '@wordpress/i18n';

// Get synchronization options from localized data
export const synchronizations = window.lmat_settings?.sync_options || [];

  // Get nonce from localized script data
export const getNonce = () => {
  return window.lmat_settings?.nonce || '';
}