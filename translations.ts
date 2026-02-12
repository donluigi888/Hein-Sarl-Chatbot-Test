import { TranslationSet, Language } from './types';

const adminEN = {
  loginTitle: "Admin Login",
  username: "Username",
  password: "Password",
  signIn: "Sign in",
  cancel: "Cancel",
  helperText: "Admin access is required to upload manuals.",
  uploadBtn: "Upload PDF",
  uploadSuccess: "Manual uploaded.",
  uploadFail: "Upload failed. Please try again.",
  invalidCreds: "Invalid credentials."
};

const credits = "developed by Louis Kohnen and flowly.lu";

export const translations: Record<Language, TranslationSet> = {
  EN: {
    sidebar: {
      start: "ACTION",
      newChat: "New Chat",
      chatbot: "Chatbot",
      askHint: "Start a fresh technical consultation.",
      quickTopics: "NAVIGATION",
      history: "History",
      manuals: "Manuals",
      errorCodes: "Request a technician",
      exportChat: "Export chat",
      maintenance: "Maintenance",
      requestService: "Coming soon...",
      privacyNote: credits
    },
    topBar: {
      title: "HEIN Assistant",
      subtitle: "Oven & Cooling Technologies",
      settings: "Settings"
    },
    welcome: {
      title: "Welcome to HEIN Support",
      description: "Ask questions about HEIN ovens and cooling systems. You can troubleshoot issues, learn operation steps, or request service.",
      heiniTitle: "Hello, I am HEINI.",
      heiniSubtitle: "How can I assist you with HEIN technologies today?"
    },
    input: {
      placeholder: "Ask something about HEIN technologies...",
      typing: "Assistant is typing..."
    },
    admin: adminEN
  },
  FR: {
    sidebar: {
      start: "ACTION",
      newChat: "Nouvelle discussion",
      chatbot: "Chatbot",
      askHint: "Démarrer une nouvelle consultation technique.",
      quickTopics: "NAVIGATION",
      history: "Historique",
      manuals: "Manuels",
      errorCodes: "Demander un technicien",
      exportChat: "Exporter la discussion",
      maintenance: "Entretien",
      requestService: "Bientôt disponible...",
      privacyNote: credits
    },
    topBar: {
      title: "Assistant HEIN",
      subtitle: "Technologies de cuisson et de refroidissement",
      settings: "Paramètres"
    },
    welcome: {
      title: "Bienvenue sur le Support HEIN",
      description: "Posez vos questions sur les fours et systèmes de refroidissement HEIN. Vous pouvez résoudre des problèmes ou demander un service.",
      heiniTitle: "Bonjour, je suis HEINI.",
      heiniSubtitle: "Comment puis-je vous aider avec les technologies HEIN aujourd'hui ?"
    },
    input: {
      placeholder: "Posez une question sur les technologies HEIN...",
      typing: "L'assistant écrit..."
    },
    admin: {
      ...adminEN,
      loginTitle: "Connexion Admin",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      signIn: "Se connecter",
      cancel: "Annuler",
      helperText: "L'accès administrateur est requis pour télécharger des manuels.",
      uploadBtn: "Télécharger PDF"
    }
  },
  DE: {
    sidebar: {
      start: "AKTION",
      newChat: "Neuer Chat",
      chatbot: "Chatbot",
      askHint: "Starten Sie eine neue technische Beratung.",
      quickTopics: "NAVIGATION",
      history: "Verlauf",
      manuals: "Handbücher",
      errorCodes: "Techniker anfordern",
      exportChat: "Chat exportieren",
      maintenance: "Wartung",
      requestService: "Demnächst verfügbar...",
      privacyNote: credits
    },
    topBar: {
      title: "HEIN Assistent",
      subtitle: "Ofen- & Kühltechnologien",
      settings: "Einstellungen"
    },
    welcome: {
      title: "Willkommen beim HEIN Support",
      description: "Stellen Sie Fragen zu HEIN Öfen und Kühlsystemen. Sie können Probleme beheben, Bedienungsschritte lernen oder Service anfordern.",
      heiniTitle: "Hallo, ich bin HEINI.",
      heiniSubtitle: "Wie kann ich Ihnen heute mit HEIN-Technologien helfen?"
    },
    input: {
      placeholder: "Fragen Sie etwas zu HEIN Technologien...",
      typing: "Assistent schreibt..."
    },
    admin: {
      ...adminEN,
      loginTitle: "Admin Login",
      username: "Benutzername",
      password: "Passwort",
      signIn: "Anmelden",
      cancel: "Abbrechen",
      helperText: "Admin-Zugriff ist erforderlich, um Handbücher hochzuladen.",
      uploadBtn: "PDF hochladen"
    }
  },
  NL: {
    sidebar: {
      start: "ACTIE",
      newChat: "Nieuwe Chat",
      chatbot: "Chatbot",
      askHint: "Start een nieuw technisch advies.",
      quickTopics: "NAVIGATIE",
      history: "Geschiedenis",
      manuals: "Handleidingen",
      errorCodes: "Technicus aanvragen",
      exportChat: "Chat exportieren",
      maintenance: "Onderhoud",
      requestService: "Binnenkort beschikbaar...",
      privacyNote: credits
    },
    topBar: {
      title: "HEIN Assistant",
      subtitle: "Oven- & Koeltechnologieën",
      settings: "Instellingen"
    },
    welcome: {
      title: "Welkom bij HEIN Support",
      description: "Stel vragen over HEIN ovens en koelsystemen. U kunt problemen oplossen, bedieningsstappen leren of service aanvragen.",
      heiniTitle: "Hallo, ik ben HEINI.",
      heiniSubtitle: "Hoe kan ik u vandaag helpen met HEIN-technologieën?"
    },
    input: {
      placeholder: "Stel een vraag over HEIN-technologieën...",
      typing: "Assistent is aan het typen..."
    },
    admin: {
      ...adminEN,
      loginTitle: "Admin Inloggen",
      username: "Gebruikersnaam",
      password: "Wachtwoord",
      signIn: "Inloggen",
      cancel: "Annuleren",
      helperText: "Beheerderstoegang is vereist om handleidingen te uploaden.",
      uploadBtn: "PDF uploaden"
    }
  }
};
