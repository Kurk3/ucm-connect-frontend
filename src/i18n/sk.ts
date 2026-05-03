// Slovenské preklady pre auth sekciu
export const sk = {
  auth: {
    // Common auth texts
    tagline: 'Vstúp do univerzitnej komunity, ktorá ťa posunie ďalej',

    // LoginView
    login: {
      title: 'Prihlásenie',
      button: 'Prihlásiť',
      buttonLoading: 'Prihlasujem...',
      errors: {
        required: 'Prosím vyplňte email a heslo',
        invalid_email: 'Prosím zadajte platný email',
        credentials: 'Nesprávne prihlasovacie údaje',
        invalid_data: 'Neplatné údaje',
        connection: 'Nie je možné pripojiť sa k serveru. Skontrolujte či backend beží.',
        general: 'Nastala chyba pri prihlasovaní. Skúste to prosím neskôr.'
      }
    },

    // RegisterView
    register: {
      title: 'Registrácia',
      button: 'Registrovať',
      buttonLoading: 'Registrujem...'
    },

    // ResetPasswordView
    resetPassword: {
      title: 'Obnova hesla',
      button: 'Zmeniť heslo'
    },

    // AuthForm - formulárové polia a texty
    form: {
      email: {
        label: 'Školský email',
        placeholder: 'Zadajte svoj školský email'
      },
      password: {
        label: 'Heslo',
        placeholder: 'Zadajte svoje heslo'
      },
      confirmPassword: {
        label: 'Potvrďte heslo',
        placeholder: 'Potvrďte svoje heslo'
      },
      links: {
        noAccount: 'Nemáte účet ?',
        forgotPassword: 'Zabudli ste vaše heslo?',
        hasAccount: 'Už máte účet? Prihláste sa'
      }
    },

    // EmailConfirmationView
    emailConfirmation: {
      title: 'Registrácia prebehla úspešne!',
      description: 'Na váš email {email} sme poslali overovací kód. Skontrolujte si prosím svoju emailovú schránku a zadajte kód nižšie.',
      verificationCode: {
        label: 'Overovací kód z emailu',
        placeholder: 'Zadajte 6-miestny kód'
      },
      buttons: {
        verify: 'Overiť email',
        goToLogin: 'Prejsť na prihlásenie'
      },
      resend: {
        default: 'Neprišiel vám email? Poslať znovu',
        cooldown: 'Poslať znovu (počkajte {seconds}s)',
        sending: 'Posielam...'
      },
      errors: {
        invalidCode: 'Prosím zadajte 6-miestny kód',
        verificationFailed: 'Neplatný alebo expirovaný kód',
        genericError: 'Nepodarilo sa overiť email. Skúste to znovu.',
        resendFailed: 'Nepodarilo sa odoslať email. Skúste neskôr.'
      },
      success: {
        verified: 'Email bol úspešne overený! Teraz sa môžete prihlásiť.',
        resent: 'Email bol znovu odoslaný!'
      }
    },

    // AuthFooter
    footer: {
      about: 'O nás',
      help: 'Centrum pomoci',
      terms: 'Podmienky používania',
      privacy: 'Ochrana súkromia',
      cookies: 'Cookies'
    }
  },

  // Sidebar
  sidebar: {
    sections: {
      general: 'Všeobecné',
      subjectsByYear: 'Predmety podľa ročníkov',
      myPosts: 'Moje príspevky'
    },
    categories: {
      latest: 'Posledné príspevky',
      networks: 'Siete',
      programming: 'Programovanie',
      tutorials: 'Tutoriály/Tech'
    },
    years: {
      first: '1. ročník',
      second: '2. ročník',
      third: '3. ročník',
      fourth: '4. ročník'
    },
    noSubjects: 'Žiadne predmety',
    noPosts: 'Žiadne príspevky',
    loading: 'Načítavam...',
    discord: 'Pripoj sa na Discord',
    logout: 'Odhlásiť sa'
  }
}