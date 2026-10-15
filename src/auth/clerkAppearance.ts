import type { ClerkProviderProps } from '@clerk/react'

export const clerkAppearance = {
  variables: {
    colorPrimary: '#A93824',
    colorPrimaryForeground: '#FFFAF2',
    colorBackground: '#FAF7F0',
    colorForeground: '#242424',
    colorMuted: '#E8E0D3',
    colorMutedForeground: '#514B43',
    colorInput: '#FAF7F0',
    colorInputForeground: '#242424',
    colorNeutral: '#696156',
    colorDanger: '#982D40',
    fontFamily: "'Zen Kaku Gothic New', ui-sans-serif, system-ui, sans-serif",
    borderRadius: '4px',
    spacing: '0.5rem',
  },
  options: {
    logoPlacement: 'none',
    socialButtonsVariant: 'blockButton',
    animations: true,
  },
  captcha: {
    theme: 'light',
  },
  elements: {
    rootBox: {
      width: '100%',
    },
    cardBox: {
      width: '100%',
    },
    card: {
      width: '100%',
      border: '1px solid #84796D',
      borderRadius: '4px',
      backgroundColor: '#FAF7F0',
      boxShadow: '0 6px 18px rgba(36, 36, 36, 0.1)',
    },
    headerTitle: {
      color: '#242424',
      fontFamily: "'Shippori Mincho', 'Noto Serif JP', ui-serif, Georgia, serif",
      fontSize: '2rem',
      fontWeight: '500',
      letterSpacing: '-0.025em',
    },
    headerSubtitle: {
      color: '#514B43',
      fontSize: '0.875rem',
      lineHeight: '1.6',
    },
    socialButtonsBlockButton: {
      minHeight: '44px',
      border: '1px solid #84796D',
      borderRadius: '4px',
      backgroundColor: '#FAF7F0',
      color: '#242424',
      fontWeight: '700',
    },
    socialButtonsBlockButtonText: {
      fontWeight: '700',
    },
    dividerLine: {
      backgroundColor: '#D2C7B8',
    },
    dividerText: {
      color: '#696156',
      fontSize: '0.6875rem',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
    },
    formFieldLabel: {
      color: '#514B43',
      fontSize: '0.75rem',
      fontWeight: '700',
    },
    formFieldInput: {
      minHeight: '44px',
      border: '1px solid #84796D',
      borderRadius: '4px',
      backgroundColor: '#FAF7F0',
      color: '#242424',
      boxShadow: 'none',
      '&::placeholder': { color: '#696156', opacity: 1 },
      '&:focus': { borderColor: '#A93824', boxShadow: '0 0 0 2px #A93824' },
    },
    formFieldInputShowPasswordButton: {
      color: '#A93824',
    },
    formButtonPrimary: {
      minHeight: '44px',
      border: '1px solid #A93824',
      borderRadius: '4px',
      backgroundColor: '#A93824',
      color: '#FFFAF2',
      '&:hover, &:active': { backgroundColor: '#8F2D1C' },
      '&:focus-visible': { outline: '2px solid #A93824', outlineOffset: '3px' },
      '&:disabled': { backgroundColor: '#696156', opacity: 1 },
      boxShadow: 'none',
      fontWeight: '700',
      letterSpacing: '0.04em',
    },
    alertText: {
      color: '#982D40',
    },
    formResendCodeLink: {
      color: '#A93824',
      fontWeight: '700',
    },
    footerActionText: {
      color: '#696156',
    },
    footerActionLink: {
      color: '#A93824',
      fontWeight: '700',
    },
    userButtonAvatarBox: {
      border: '1px solid #84796D',
    },
    userButtonPopoverCard: {
      border: '1px solid #84796D',
      borderRadius: '4px',
      backgroundColor: '#FAF7F0',
      boxShadow: '0 6px 18px rgba(36, 36, 36, 0.1)',
    },
    userButtonPopoverActionButton: {
      borderRadius: '4px',
    },
    userButtonPopoverActionButtonText: {
      color: '#242424',
    },
  },
} satisfies NonNullable<ClerkProviderProps['appearance']>
