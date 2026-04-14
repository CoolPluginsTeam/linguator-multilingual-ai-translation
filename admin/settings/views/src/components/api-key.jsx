import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Input, Label } from '@bsf/force-ui'
import apiFetch from "@wordpress/api-fetch"
import { toast } from 'sonner'
import { __, sprintf } from '@wordpress/i18n'
import { getNonce } from '../utils'
import { GeminiIcon } from '../../../../../assets/logo/gemini'
import { OpenAIIcon } from '../../../../../assets/logo/openai'
import { AnthropicIcon } from '../../../../../assets/logo/anthropic'

const RESET_SENTINEL = '__RESET__'

const providerIcons = {
  gemini: GeminiIcon,
  openai: OpenAIIcon,
  anthropic: AnthropicIcon,
}

const providerKeyLinks = {
  gemini: 'https://aistudio.google.com/app/api-keys',
  openai: 'https://platform.openai.com/api-keys',
  anthropic: 'https://platform.claude.com/',
}

const providerKeyLabels = {
  gemini: 'Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
}

const providerMeta = [
  {
    key: 'gemini',
    modelKey: 'gemini_model',
    heading: __('Add Gemini API key', 'linguator-multilingual-ai-translation'),
    modelHeading: __('Select Gemini Model', 'linguator-multilingual-ai-translation'),
    placeholder: 'AIza…',
  },
  {
    key: 'openai',
    modelKey: 'openai_model',
    heading: __('Add OpenAI API key', 'linguator-multilingual-ai-translation'),
    modelHeading: __('Select OpenAI Model', 'linguator-multilingual-ai-translation'),
    placeholder: 'sk-…',
  },
  {
    key: 'anthropic',
    modelKey: 'anthropic_model',
    heading: __('Add Anthropic API key', 'linguator-multilingual-ai-translation'),
    modelHeading: __('Select Anthropic Model', 'linguator-multilingual-ai-translation'),
    placeholder: 'sk-ant-…',
  },
]

const ApiKey = ({ data, setData }) => {
  const [loading, setLoading] = useState(true)
  const [masked, setMasked] = useState({ openai: '', gemini: '', anthropic: '' })
  const [configured, setConfigured] = useState({ openai: false, gemini: false, anthropic: false })
  const [keyDrafts, setKeyDrafts] = useState({ openai: '', gemini: '', anthropic: '' })
  const [availableModels, setAvailableModels] = useState({ openai: [], gemini: [], anthropic: [] })
  const [models, setModels] = useState({
    openai_model: 'gpt-4o-mini',
    gemini_model: 'gemini-2.0-flash',
    anthropic_model: 'claude-3-5-sonnet-latest',
  })
  const [handleButtonDisabled, setHandleButtonDisabled] = useState(true)
  const initialModelsRef = useRef({
    openai_model: 'gpt-4o-mini',
    gemini_model: 'gemini-2.0-flash',
    anthropic_model: 'claude-3-5-sonnet-latest',
  })

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiFetch({
          path: 'lmat/v1/api-keys',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce(),
          },
        })

        const keys = resp?.keys || {}
        const m = resp?.models || {}
        const discovered = resp?.available_models || {}

        const nextMasked = {
          openai: keys?.openai || '',
          gemini: keys?.gemini || '',
          anthropic: keys?.anthropic || '',
        }

        setMasked(nextMasked)
        setConfigured({
          openai: Boolean(nextMasked.openai),
          gemini: Boolean(nextMasked.gemini),
          anthropic: Boolean(nextMasked.anthropic),
        })
        const nextModels = {
          openai_model: m?.openai_model || 'gpt-4o-mini',
          gemini_model: m?.gemini_model || 'gemini-2.0-flash',
          anthropic_model: m?.anthropic_model || 'claude-3-5-sonnet-latest',
        }
        setModels(nextModels)
        initialModelsRef.current = nextModels
        setAvailableModels({
          openai: Array.isArray(discovered?.openai) ? discovered.openai : [],
          gemini: Array.isArray(discovered?.gemini) ? discovered.gemini : [],
          anthropic: Array.isArray(discovered?.anthropic) ? discovered.anthropic : [],
        })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    const hasKeyChanges = Object.values(keyDrafts).some((v) => (v || '').trim() !== '')
    const initial = initialModelsRef.current || {}
    const hasModelChanges =
      (models.openai_model || '') !== (initial.openai_model || '') ||
      (models.gemini_model || '') !== (initial.gemini_model || '') ||
      (models.anthropic_model || '') !== (initial.anthropic_model || '')

    setHandleButtonDisabled(!(hasKeyChanges || hasModelChanges))
  }, [keyDrafts, models, configured.openai, configured.gemini, configured.anthropic])

  async function SaveSettings({ resetProvider } = {}) {
    try {
      const keys = {}
      const modelsBody = {
        openai_model: models.openai_model,
        gemini_model: models.gemini_model,
        anthropic_model: models.anthropic_model,
      }

      for (const { key } of providerMeta) {
        const draft = (keyDrafts[key] || '').trim()

        if (resetProvider === key) {
          keys[key] = ''
          continue
        }

        if (draft !== '') {
          keys[key] = draft
        }
      }

      const apiBody = { keys, models: modelsBody }

      const response = apiFetch({
        path: 'lmat/v1/api-keys',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce(),
        },
        body: JSON.stringify(apiBody),
      })
        .then((resp) => {
          const nextMasked = {
            openai: resp?.keys?.openai || '',
            gemini: resp?.keys?.gemini || '',
            anthropic: resp?.keys?.anthropic || '',
          }
          setMasked(nextMasked)
          setConfigured({
            openai: Boolean(nextMasked.openai),
            gemini: Boolean(nextMasked.gemini),
            anthropic: Boolean(nextMasked.anthropic),
          })
          const m = resp?.models || {}
          const nextModels = {
            openai_model: m?.openai_model || models.openai_model,
            gemini_model: m?.gemini_model || models.gemini_model,
            anthropic_model: m?.anthropic_model || models.anthropic_model,
          }
          setModels(nextModels)
          initialModelsRef.current = nextModels
          const discovered = resp?.available_models || {}
          setAvailableModels({
            openai: Array.isArray(discovered?.openai) ? discovered.openai : [],
            gemini: Array.isArray(discovered?.gemini) ? discovered.gemini : [],
            anthropic: Array.isArray(discovered?.anthropic) ? discovered.anthropic : [],
          })
          setKeyDrafts({ openai: '', gemini: '', anthropic: '' })
          setHandleButtonDisabled(true)
          return resp
        })
        .catch((error) => {
          if (error?.message) {
            throw new Error(error.message)
          }
          throw new Error(__("Something went wrong", 'linguator-multilingual-ai-translation'))
        })

      toast.promise(response, {
        loading: __('Saving Settings', 'linguator-multilingual-ai-translation'),
        success: __('Settings Saved', 'linguator-multilingual-ai-translation'),
        error: (error) => error.message,
      })
    } catch (error) {
      toast.error(error?.message || __("Something went wrong", "linguator-multilingual-ai-translation"))
    }
  }

  // Keep provider visibility in sync with Translation Config + Wizard toggles (both persist to ai_translation_configuration.provider)
  const wpAiClientAvailable = Boolean(window?.lmat_settings?.wp_ai_client_available)
  const providerConfig = data?.ai_translation_configuration?.provider
  const visibleProviders = providerMeta.filter((p) => {
    if (!wpAiClientAvailable) return false
    // If provider settings aren't present yet, default to showing the inputs.
    if (!providerConfig) return true
    // If provider settings exist, show only the providers that are explicitly enabled.
    return Boolean(providerConfig?.[p.key])
  })

  return (
    <Container className='bg-white p-10 rounded-lg shadow-sm' cols="1" containerType='grid'>
      <Container.Item className="flex items-start justify-between gap-6">
        <div>
          <h2 className="m-0 text-lg font-semibold">{__('AI API Keys & Models', 'linguator-multilingual-ai-translation')}</h2>
          <p className="mt-1 mb-0 text-sm text-gray-600">{__('Configure your API keys and models for the AI translation providers.', 'linguator-multilingual-ai-translation')}</p>
        </div>
        <Button
          disabled={handleButtonDisabled}
          size="md"
          tag="button"
          type="button"
          onClick={() => SaveSettings()}
          variant="primary"
        >
          {loading ? __('Loading…', 'linguator-multilingual-ai-translation') : __('Save', 'linguator-multilingual-ai-translation')}
        </Button>
      </Container.Item>

      <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />

      <Container cols="1" containerType="grid" className="gap-8">
        {visibleProviders.map((p) => {
          const isConfigured = configured[p.key]
          const draft = keyDrafts[p.key] || ''
          const displayValue = draft === '' && isConfigured ? (masked[p.key] || '') : draft
          const Icon = providerIcons[p.key]
          const selectedModel = (models?.[p.modelKey] || '').trim()
          const listFromApi = Array.isArray(availableModels?.[p.key]) ? availableModels[p.key] : []
          const providerModelList = [
            ...listFromApi,
            ...(selectedModel && !listFromApi.includes(selectedModel) ? [selectedModel] : []),
          ]

          return (
            <Container.Item
              key={p.key}
              className="p-6 rounded-lg bg-white"
              style={{ border: "1px solid #e5e7eb" }}
            >
              {Icon ? (
                <h3 className="flex items-center gap-2 m-0 text-base font-semibold mb-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {p.heading}
                </h3>
              ) : null}

              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <Input
                    aria-label={`${p.key}-api-key`}
                    id={`${p.key}-api-key`}
                    size="md"
                    type="text"
                    placeholder={p.placeholder}
                    value={displayValue}
                    onChange={(v) => setKeyDrafts((prev) => ({ ...prev, [p.key]: v }))}
                  />
                  {providerKeyLinks[p.key] ? (
                    <div className="mt-2 text-sm text-gray-600">
                      {sprintf(__('Get your %s API key from ', 'linguator-multilingual-ai-translation'), providerKeyLabels[p.key] || p.key)}{' '}
                      <a href={providerKeyLinks[p.key]} target="_blank" rel="noopener noreferrer">
                        {__('here', 'linguator-multilingual-ai-translation')}
                      </a>
                    </div>
                  ) : null}
                </div>

                <div className="flex-shrink-0">
                  <Button
                    size="md"
                    tag="button"
                    type="button"
                    variant="primary"
                    onClick={() => SaveSettings({ resetProvider: p.key })}
                    disabled={!isConfigured}
                  >
                    {__('Reset', 'linguator-multilingual-ai-translation')}
                  </Button>
                </div>
              </div>

              {isConfigured ? (
                <div className="mt-8">
                  <Label size="sm" className="font-medium mb-2 block">{p.modelHeading}</Label>
                  <div className="mt-0" style={{ maxWidth: 320 }}>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      value={models[p.modelKey] || ''}
                      onChange={(e) => setModels((prev) => ({ ...prev, [p.modelKey]: e.target.value }))}
                    >
                      <option value="">{__('Select model…', 'linguator-multilingual-ai-translation')}</option>
                      {providerModelList.map((id) => (
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
            </Container.Item>
          )
        })}
      </Container>
    </Container>
  )
}

export default ApiKey
