import type { ClerkProviderProps } from '@clerk/react'

export const clerkAppearance = {
  variables: {
    colorPrimary: '#a855f7',
    colorPrimaryForeground: '#f5f0ff',
    colorBackground: '#171024',
    colorForeground: '#f5f0ff',
    colorMuted: '#211638',
    colorMutedForeground: '#d8cef0',
    colorInput: '#0f0a1b',
    colorInputForeground: '#f5f0ff',
    colorNeutral: '#9484b8',
    colorDanger: '#f0abfc',
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
    theme: 'dark',
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
      border: '1px solid rgba(196, 181, 253, 0.32)',
      borderRadius: '4px',
      backgroundColor: '#171024',
      boxShadow: '0 20px 52px rgba(5, 2, 12, 0.34)',
    },
    headerTitle: {
      color: '#f5f0ff',
      fontFamily: "'Shippori Mincho', 'Noto Serif JP', ui-serif, Georgia, serif",
      fontSize: '2rem',
      fontWeight: '500',
      letterSpacing: '-0.025em',
    },
    headerSubtitle: {
      color: '#d8cef0',
      fontSize: '0.875rem',
      lineHeight: '1.6',
    },
    socialButtonsBlockButton: {
      minHeight: '44px',
      border: '1px solid rgba(196, 181, 253, 0.32)',
      borderRadius: '4px',
      backgroundColor: 'rgba(33, 22, 56, 0.74)',
      color: '#f5f0ff',
      fontWeight: '700',
    },
    socialButtonsBlockButtonText: {
      fontWeight: '700',
    },
    dividerLine: {
      backgroundColor: 'rgba(196, 181, 253, 0.16)',
    },
    dividerText: {
      color: '#9484b8',
      fontSize: '0.6875rem',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
    },
    formFieldLabel: {
      color: '#d8cef0',
      fontSize: '0.75rem',
      fontWeight: '700',
    },
    formFieldInput: {
      minHeight: '44px',
      border: '1px solid rgba(196, 181, 253, 0.32)',
      borderRadius: '4px',
      backgroundColor: '#0f0a1b',
      color: '#f5f0ff',
      boxShadow: 'none',
    },
    formFieldInputShowPasswordButton: {
      color: '#c4b5fd',
    },
    formButtonPrimary: {
      minHeight: '44px',
      border: '1px solid #a855f7',
      borderRadius: '4px',
      backgroundColor: '#7c3aed',
      color: '#f5f0ff',
      boxShadow: 'none',
      fontWeight: '700',
      letterSpacing: '0.04em',
    },
    alertText: {
      color: '#f0abfc',
    },
    formResendCodeLink: {
      color: '#c4b5fd',
      fontWeight: '700',
    },
    footerActionText: {
      color: '#9484b8',
    },
    footerActionLink: {
      color: '#c4b5fd',
      fontWeight: '700',
    },
    userButtonAvatarBox: {
      border: '1px solid rgba(196, 181, 253, 0.56)',
    },
    userButtonPopoverCard: {
      border: '1px solid rgba(196, 181, 253, 0.32)',
      borderRadius: '4px',
      backgroundColor: '#171024',
      boxShadow: '0 18px 46px rgba(5, 2, 12, 0.42)',
    },
    userButtonPopoverActionButton: {
      borderRadius: '4px',
    },
    userButtonPopoverActionButtonText: {
      color: '#f5f0ff',
    },
  },
} satisfies NonNullable<ClerkProviderProps['appearance']>
