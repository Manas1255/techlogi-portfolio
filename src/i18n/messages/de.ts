import type { Messages } from "../types";

/**
 * GERMAN CATALOG.
 *
 * `satisfies Messages` at the bottom is what keeps this honest: adding a key
 * to `en.ts` is a COMPILE ERROR here until it is translated, so a string can
 * never silently fall back to English on a page served at `/de`.
 *
 * Register and tone, decided once and applied throughout:
 *
 *   · **Sie**, never du. The reader is a founder or an operations lead
 *     evaluating a supplier. German B2B convention is Sie, and du from a
 *     stranger asking for a meeting reads as either a startup affectation or
 *     a mistranslation, both of which cost more than the warmth gains.
 *   · Translated, not transliterated. The English copy is deliberately plain
 *     and slightly blunt, and the German has to be plain and slightly blunt
 *     too rather than sliding into the noun-stacked Behördendeutsch that a
 *     literal rendering produces. "Wir sagen es Ihnen im Gespräch", not "Eine
 *     entsprechende Mitteilung erfolgt im Rahmen des Gesprächs".
 *   · Industry English stays English where German professionals use it:
 *     Website, App, SaaS, Backend, Deployment, Design-System. Translating
 *     those reads as a machine did it.
 *
 * ⚠️ Written by an engineer, not a native-speaking copywriter, and it should
 * have a native pass before launch. The German is correct and idiomatic as far
 * as it goes; what a native would improve is rhythm and the handful of places
 * where the English pun does not carry.
 */
const de = {
  common: {
    actions: {
      save: "Speichern",
      cancel: "Abbrechen",
      create: "Erstellen",
      edit: "Bearbeiten",
      delete: "Löschen",
      confirm: "Bestätigen",
      close: "Schließen",
      search: "Suchen",
      retry: "Erneut versuchen",
      back: "Zurück",
      next: "Weiter",
      copy: "Kopieren",
      copied: "Kopiert",
      clear: "Zurücksetzen",
      viewAll: "Alle ansehen",
    },
    states: {
      loading: "Wird geladen…",
      noResults: "Keine Ergebnisse",
      noResultsHint:
        "Versuchen Sie eine andere Suche oder einen anderen Filter.",
      errorTitle: "Da ist etwas schiefgelaufen",
      errorHint:
        "Die Anfrage ist nicht durchgegangen. Sie können es erneut versuchen.",
      notFoundTitle: "Seite nicht gefunden",
      notFoundHint: "Die gesuchte Seite gibt es nicht oder sie ist umgezogen.",
    },
    pagination: {
      summary: "{from}–{to} von {total}",
      previous: "Zurück",
      next: "Weiter",
      page: "Seite {page} von {pages}",
      rowsPerPage: "Zeilen pro Seite",
    },
    table: {
      columns: "Spalten",
      sortAscending: "Aufsteigend sortieren",
      sortDescending: "Absteigend sortieren",
      selected: "{count} ausgewählt",
      openMenu: "Menü öffnen",
    },
    confirm: {
      deleteTitle: "Diesen Eintrag löschen?",
      deleteDescription: "Das lässt sich nicht rückgängig machen.",
    },
    language: "Sprache",
    theme: "Design",
  },

  nav: {
    home: "Start",
    work: "Projekte",
    services: "Leistungen",
    about: "Über uns",
    contact: "Kontakt",
    openMenu: "Navigation öffnen",
    closeMenu: "Navigation schließen",
    primary: "Hauptnavigation",
    skipToContent: "Zum Inhalt springen",
  },

  booking: {
    trigger: "Gespräch buchen",
    duration: "30 Minuten",
    ariaOpen: "Buchungskalender öffnen",
  },

  inquiry: {
    trigger: "Projekt beschreiben",
    title: "Projekt beschreiben",
    subtitle:
      "Vier kurze Schritte, dann wählen Sie eine Zeit. Was Sie getippt haben, bleibt erhalten, wenn Sie schließen.",
    privacy:
      "Wir nutzen Ihre Angaben, um zu antworten, und für sonst nichts. Kein Newsletter, keine Follow-up-Serie, und wir geben sie nicht weiter.",
    privacyShort:
      "Ihre Angaben nutzen wir nur für die Antwort. Kein Newsletter.",
    steps: {
      build: "Was Sie brauchen",
      brief: "Zum Projekt",
      contact: "Wie wir Sie erreichen",
    },
    step1: {
      title: "Was können wir für Sie bauen?",
      lead: "Nehmen Sie, was am nächsten kommt. Nichts davon ist verbindlich.",
    },
    step2: {
      title: "Erzählen Sie davon",
      lead: "In Ihren eigenen Worten. Was es können soll, zählt weit mehr als wie es heißt.",
    },
    step3: {
      title: "Wie erreichen wir Sie?",
      lead: "Ein Mensch liest Ihre Beschreibung und antwortet innerhalb von 60 Minuten, meist gleich mit Terminvorschlägen.",
    },
    more: "Budget, Zeitrahmen oder Dateien ergänzen (optional)",
    /* Die vier Schritte. Jeder benennt in der Sprache der Besucherin, was er
       will, und die Zeile darunter sagt, warum gefragt wird. */
    flow: {
      progress: "Schritt {current} von {total}",
      optional: "Optional",
      stage: {
        title: "Wo stehen Sie gerade?",
        lead: "Ein Tipp genügt. Das ist der ganze erste Schritt.",
      },
      idea: {
        title: "Erzählen Sie uns die Idee",
        lead: "Ein paar Sätze. Wir lesen jeden davon selbst.",
      },
      prepare: {
        title: "Was uns hilft, uns vorzubereiten",
        lead: "Überspringen Sie alles, wenn Sie lieber gleich sprechen.",
      },
      contact: {
        title: "Wohin soll die Einladung?",
        lead: "Letzter Schritt, dann wählen Sie eine Zeit.",
      },
    },
    /* Diktieren statt Tippen, nur im Ideen-Schritt und nur dort, wo der
       Browser wirklich eine Spracherkennung hat. */
    dictate: {
      start: "Oder sprechen Sie es einfach",
      stop: "Stopp",
      hint: "Wir tippen es für Sie mit.",
      listening:
        "Wir hören zu. Sprechen Sie ganz normal und drücken Sie Stopp, wenn Sie fertig sind.",
      denied:
        "Ihr Browser blockiert das Mikrofon. Erlauben Sie es in der Adressleiste, oder tippen Sie einfach.",
      failed: "Das Diktieren funktioniert gerade nicht. Tippen geht weiterhin.",
    },
    fields: {
      buildType: {
        label: "Was möchten Sie bauen?",
        // Short on purpose: a select trigger is a fixed box, and German runs
        // long enough that the English-length placeholder overflowed it.
        placeholder: "Bitte wählen",
      },
      description: {
        label: "Beschreiben Sie Ihre Idee kurz",
        hint: "Zwei, drei Sätze reichen völlig. Was passiert heute, und was soll sich ändern?",
        placeholder:
          "Wir planen die Termine für elf Praxen über drei Tabellen, und unsere Koordinatorinnen verlieren damit jede Woche Stunden…",
      },
      services: {
        label: "Wobei brauchen Sie Unterstützung?",
        hint: "Optional. Wählen Sie so viel oder so wenig Sie möchten.",
      },
      stage: {
        label: "Wie ist Ihr aktueller Stand?",
        hint: "Es gibt keine falsche Antwort. Sie sagt uns nur, welches Gespräch das richtige ist.",
        placeholder: "Bitte wählen",
      },
      timeline: {
        label: "Wann möchten Sie starten?",
        hint: "Eine grobe Antwort genügt. Nichts davon ist verbindlich.",
        placeholder: "Noch offen",
      },
      budget: {
        label: "Welches Budget haben Sie ungefähr eingeplant?",
        placeholder: "Spanne genügt",
        hint: "Kein Angebot und keine Zusage. Es sagt uns nur, welche Teamgröße passt.",
      },
      anythingElse: {
        label: "Gibt es noch etwas, das wir vor dem Gespräch wissen sollten?",
        hint: "Optional. Eine Rahmenbedingung, ein Termin, eine Frage, die Sie zuerst geklärt haben möchten.",
        placeholder:
          "Wir müssen bei unserem jetzigen Zahlungsanbieter bleiben, und die Geschäftsführung möchte im März etwas sehen…",
      },
      name: {
        label: "Vor- und Nachname",
        hint: "Damit wir wissen, mit wem wir im Gespräch sprechen.",
        placeholder: "Anna Schmidt",
      },
      company: { label: "Unternehmen (optional)" },
      email: {
        label: "E-Mail-Adresse",
        hint: "Dorthin gehen die Termineinladung und unsere Antwort. Wir tragen Sie in keinen Verteiler ein.",
        placeholder: "anna@firma.de",
      },
      phone: {
        label: "Telefon oder WhatsApp (optional)",
        hint: "Nur, wenn wir Sie lieber dort erreichen sollen als per E-Mail.",
        placeholder: "+49 151 23456789",
      },
    },
    /* Optionsbeschriftungen der drei Auswahlfelder. Sie standen als englische
       Literale in `inquiry.schema.ts` und erschienen auf der deutschen Seite
       unübersetzt. */
    options: {
      stage: {
        idea: "Bisher nur eine Idee",
        concept: "Das Konzept steht bereits",
        design: "Design ist vorhanden",
        existingApp: "Bestehende App soll verbessert werden",
      },
      timeline: {
        asap: "So schnell wie möglich",
        months: "In den nächsten Monaten",
        later: "Später in diesem Jahr",
        exploring: "Wir schauen uns erst einmal um",
      },
      budget: {
        under5k: "Unter 5.000 $",
        from5to10k: "5.000 $ - 10.000 $",
        from10to25k: "10.000 $ - 25.000 $",
        over25k: "Mehr als 25.000 $",
        unsure: "Noch nicht absehbar",
        private: "Möchte ich nicht angeben",
      },
    },
    attachment: {
      label: "Hängen Sie an, was hilft (optional)",
      /* Die eingeklappte Zusammenfassung. Bewusst nicht `label`, das das
         Feld darin wiederholt. */
      toggle: "Datei anhängen",
      choose: "Dateien wählen",
      drop: "oder hier ablegen",
      hint: "Jedes Format, bis zu {max} pro Datei.",
      remove: "{name} entfernen",
      count: "{count} angehängt",
      tooLarge:
        "{name} ist größer als {max}. Schicken Sie die Datei mit Ihrer Antwort nach, oder teilen Sie einen Link.",
      tooMany:
        "Hier bis zu {max} Dateien. Den Rest bringen Sie ins Gespräch mit.",
    },
    actions: {
      back: "Zurück",
      next: "Weiter",
      change: "Ändern",
      submit: "Absenden",
      continueToBooking: "Weiter zur Terminwahl",
      skip: "Überspringen",
      submitting: "Wird gesendet…",
    },
    success: {
      title: "Beschreibung gesendet",
      heading: "Danke, das ist bei uns.",
      bookingBody:
        "Ihre Beschreibung ist bei uns, und der Kalender ist offen. Wählen Sie eine Zeit, die Ihnen passt, wir haben bis dahin alles gelesen.",
      body: "Ein Mensch liest jede Beschreibung und antwortet innerhalb von 60 Minuten. Wenn Sie nicht warten möchten, buchen Sie ein Gespräch und wählen Sie jetzt eine Zeit.",
      close: "Schließen",
      another: "Noch eine senden",
    },
    error: {
      title: "Das ging nicht raus.",
    },
    validation: {
      descriptionShort:
        "Ein, zwei Sätze mehr, damit wir sinnvoll antworten können",
      stageRequired:
        "Wählen Sie das Naheliegendste, die Details klären wir im Gespräch",
      buildTypeRequired:
        "Wählen Sie das Naheliegendste, den Rest klären wir im Gespräch",
    },
  },

  hero: {
    line1: "Wir machen aus Ihrer Idee",
    line2: "eine App, die",
    accent: "Geld verdient",
    lead: "Websites, Apps, SaaS-Plattformen und KI-Produkte, von der Idee bis zu etwas, das Menschen wirklich nutzen.",
    answers: {
      talk: {
        label: "Diese Woche sprechen",
        detail: "Sie wählen den Termin, keine Warteschlange",
      },
      ship: {
        label: "Alle 2 Wochen ausliefern",
        detail: "Ein lauffähiger Stand, kein Statusbericht",
      },
      straight: {
        label: "Klare Antworten",
        detail: "Auch wenn es eine schlechte Idee ist",
      },
    },
  },

  products: {
    heading: "Ausgeliefert und in den Stores",
    viewCaseStudy: "Fallstudie ansehen",
  },

  howItWorks: {
    eyebrow: "So läuft es ab",
    title: "Fünf Schritte. Der erste dauert dreißig Minuten.",
    lead: "Kein Ausschreibungsverfahren, kein Discovery-Honorar, bevor überhaupt jemand gesprochen hat. Sie buchen einen Termin, wir sagen Ihnen ehrlich, ob wir das richtige Team sind, und dann geht es weiter.",
    youGet: "Sie bekommen",
  },

  whatWeBuild: {
    eyebrow: "Was wir bauen",
    title: "Acht Dinge, die wir bauen, und wo wir sie gebaut haben.",
    lead: "Jede Technologie hier ist eine, die wir ausgeliefert haben, nicht eine, die wir lernen könnten. Wo wir auf das Projekt zeigen können, tun wir es.",
    cta: "Über Ihres sprechen",
    shippedIn: "Ausgeliefert in {project}",
  },

  featuredWork: {
    eyebrow: "Ausgewählte Projekte",
    title: "Vier davon, ordentlich aufgeschrieben.",
    lead: "Jedes ist live gegangen und läuft weiter. Jede Fallstudie beschreibt das Problem, den Weg und die Abwägungen, auch die, die nicht aufgegangen sind.",
  },

  proof: {
    eyebrow: "Belege",
    title: "Wie die Zusammenarbeit mit uns wirklich ist.",
    lead: "Die Stellen, an denen die Zusammenarbeit mit einer Agentur üblicherweise schiefgeht, und was wir dagegen tun. Jede Antwort hier können Sie am Rest dieser Seite überprüfen.",
    inTheirWords: "In eigenen Worten",
    awaitingClip: "Warten auf ein Kundenvideo",
    noQuotesYet:
      "Wir veröffentlichen ein Kundenzitat erst, wenn eine namentlich genannte Person eines namentlich genannten Unternehmens es schriftlich freigegeben hat. Das ist noch nicht geschehen, deshalb bleibt dieser Platz leer statt mit Erfundenem gefüllt.",
    usualExperience: "Wie es üblicherweise läuft",
    howWeWork: "Wie wir arbeiten",
    unmute: "{person} laut stellen",
    mute: "{person} stumm schalten",
  },

  faq: {
    eyebrow: "Fragen",
    title: "Was Leute fragen, bevor sie sich melden.",
    lead: "Klare Antworten, auch die zum Geld. Wenn Ihre nicht dabei ist, ist sie eine gute erste Frage im Gespräch.",
    orEmail: "Oder schreiben Sie an",
  },

  bookACall: {
    eyebrow: "Gespräch buchen",
    title: "Wählen Sie eine Zeit. Wir sagen Ihnen, was es braucht.",
    lead: "Dreißig Minuten, kein Pitch Deck. Bringen Sie eine grobe Idee oder ein fertiges Konzept mit und gehen Sie mit einer klaren Antwort zu Umfang, Kosten und Passung heraus.",
    preferToWrite: "Lieber schreiben?",
    withYourFiles: "mit Ihren Dateien, oder schreiben Sie an",
    whatHappens: {
      slot: {
        title: "Sie wählen den Termin",
        body: "Ein echter Kalender, keine Warteschlange. Die meisten finden innerhalb von achtundvierzig Stunden etwas.",
      },
      prepared: {
        title: "Wir kommen vorbereitet",
        body: "Wir lesen vorab, was Sie schicken, damit das Gespräch beim interessanten Teil beginnt.",
      },
      bring: {
        title: "Bringen Sie mit, was da ist",
        body: "Ein Konzept, einen Figma-Link, Screenshots, einen Wettbewerber, den Sie mögen, oder gar nichts.",
      },
    },
    scheduler: {
      title: "Die Terminbuchung kommt in Kürze",
      body: "Die Selbstbuchung wird gerade freigeschaltet. Bis dahin schicken Sie uns Ihr Projekt und wir melden uns innerhalb von 60 Minuten mit Terminen, oder Sie schreiben uns und wir antworten darauf.",
      loading: "Freie Zeiten werden geladen, {duration}",
    },
  },

  offer: {
    appliesTo: "Ihre erste Projektrechnung",
    percentOff: "{percent}% Rabatt",
    ifYouBookWithin: "wenn Sie buchen innerhalb von",
    quote: "Nennen Sie",
    onTheCall: "im Gespräch. Gilt für {appliesTo}.",
    expired:
      "Ihr Zeitfenster für die {percent}% ist abgelaufen. Buchen Sie trotzdem, wir sprechen gern.",
    secondsLeft: "Noch {seconds} Sekunden für {percent} Prozent Rabatt",
  },

  confidentiality: {
    headline: "Ihre Idee bleibt Ihre",
    line: "Gelesen nur von den Menschen, die es bauen würden, nie wiederverwendet, nie weitergegeben. Gern unterschreiben wir vorab Ihre NDA.",
    point1:
      "Was Sie teilen, bleibt zwischen Ihnen und den Menschen in Ihrem Projekt.",
    point2:
      "Wir verwenden Ihr Konzept, Ihre Recherche und Ihre Unterlagen nirgendwo sonst.",
    point3: "Gern unterschreiben wir vorab Ihre NDA, oder schicken unsere.",
  },

  seo: {
    workTitle: "Projekte",
    workDescription:
      "Ausgewählte Arbeiten von GA Code: Apps, SaaS-Plattformen, Websites und KI-Produkte, mit dem Problem und dem Weg dahinter.",
    servicesTitle: "Leistungen",
    servicesDescription:
      "Was GA Code baut: Websites, Apps, SaaS-Plattformen, KI-Produkte, Zahlungen, interne Tools und MVPs, und was Sie jeweils bekommen.",
    aboutTitle: "Über uns",
    aboutDescription:
      "Wie GA Code arbeitet: schriftliche Pläne, Validierung an jeder Grenze, jeder Zustand entworfen, und ein Team, das nach dem Launch bleibt.",
    contactTitle: "Gespräch buchen",
    contactDescription:
      "Buchen Sie 30 Minuten mit den Menschen, die es bauen würden, oder beschreiben Sie Ihr Projekt. Klare Antworten zu Umfang, Kosten und Passung.",
    homeDescription:
      "GA Code baut Websites, Apps, SaaS-Plattformen und KI-Produkte. Buchen Sie ein 30-minütiges Gespräch und bekommen Sie klare Antworten zu Umfang und Kosten.",
  },

  contact: {
    responseTime:
      "Wir lesen jede Projektbeschreibung und antworten innerhalb von 60 Minuten.",
  },

  stack: {
    eyebrow: "Stack",
    title: "Nach dem Problem gewählt, nicht nach dem Lebenslauf.",
    lead: "Wir haben Meinungen, aber keine Glaubenssätze. Wo das Team eines Kunden etwas bereits gut betreibt, arbeiten wir darin statt daran vorbei.",
  },

  pages: {
    work: {
      eyebrow: "Ausgewählte Projekte",
      title: "{count} Produkte, komplett gebaut und weiterhin im Einsatz.",
      lead: "Jede Fallstudie beschreibt das Problem, den Weg und die Abwägungen, auch die Entscheidungen, die wir heute anders treffen würden.",
      draftNote:
        "Diese Fallstudien sind vorläufige Platzhalter. Struktur, Bildmaterial und Kennzahlen sind echte Bausteine, die auf freigegebene Kundenprojekte warten.",
      closeTitle: "Ihres könnte das nächste hier sein.",
      closeLead:
        "Dreißig Minuten, in denen Sie erzählen, was Sie bauen, und eine klare Antwort, ob wir das Team dafür sind.",
    },
    services: {
      eyebrow: "Leistungen",
      title:
        "Alles, was es braucht, um ein Produkt in Produktion zu bringen und dort zu halten.",
      lead: "Die meisten Projekte greifen auf mehrere davon gleichzeitig zurück. Sie stehen einzeln, damit klar ist, was Sie tatsächlich beauftragen und was Sie am Ende bekommen.",
      group: "Leistungsbereich",
      whatYouReceive: "Was Sie bekommen",
      closeTitle: "Nicht sicher, was davon Sie brauchen?",
      closeLead:
        "Genau dafür ist das erste Gespräch da. Bringen Sie das Problem mit, kein Lastenheft, und wir finden gemeinsam die Form.",
    },
    about: {
      eyebrow: "Über GA Code",
      title: "Ein Produktunternehmen, das Aufträge annimmt.",
      lead: "Wir arbeiten, wie ein gutes internes Team arbeitet, mit dem Unterschied, dass wir es in vielen Domänen getan haben und Ihnen die Codebasis, die Dokumentation und die Fähigkeit hinterlassen, ohne uns weiterzumachen.",
      principlesEyebrow: "Wie wir arbeiten",
      principlesTitle: "Sechs Dinge, bei denen wir konsequent sind.",
      principlesLead:
        "Keine Werte an der Wand. Das sind die Entscheidungen, die in jedem Projekt auftauchen, und die, deren Fehlen ein Kunde bemerken würde.",
      principles: {
        plan: {
          title: "Wir schreiben den Plan auf",
          body: "Die Discovery endet mit einem Dokument, das Sie einem anderen Team geben könnten und dasselbe Produkt bekämen. Was wir nicht aufschreiben können, haben wir noch nicht verstanden, und Sie auch nicht.",
        },
        boundary: {
          title: "An den Rändern bricht es",
          body: "Jede äußere Kante, eine Backend-Antwort, ein Formular, ein Datei-Upload, eine fremde API, wird in beide Richtungen validiert. Ein umbenanntes Feld soll an der Naht laut scheitern, nicht drei Screens später leise.",
        },
        states: {
          title: "Jeder Zustand, nicht nur der glückliche Pfad",
          body: "Laden, leer, Fehler, offline und zu viele Daten werden entworfen, bevor der Bau beginnt. Sie sind das Meiste, was Nutzer an einem schlechten Tag erleben, und dieser Tag entscheidet über das Vertrauen.",
        },
        boring: {
          title: "Langweilig, wo es zählt",
          body: "Für die tragenden Teile wählen wir gut verstandene Technologie und heben uns das Neue für die Stellen auf, an denen es etwas einbringt. Ein Stack, der interessant sein soll, ist eine Wartungsrechnung, die jemand anderes zahlt.",
        },
        stay: {
          title: "Wir bleiben nach dem Launch",
          body: "Die Wochen nach dem Go-live sagen mehr als die Monate davor. Wir planen sie ein: eine Nachbetrachtung an den vereinbarten Maßstäben und ein Backlog aus echter Nutzung statt aus dem ursprünglichen Plan.",
        },
        honest: {
          title: "Wir sagen, was wir nicht wissen",
          body: "Schätzungen kommen mit ihren Annahmen. Risiken stehen einzeln da, bevor sie ein Budget festlegen, nicht erst währenddessen. Wenn wir ein Projekt für eine schlechte Idee halten, hören Sie das, solange es noch günstig ist.",
        },
      },
      engagementsEyebrow: "Zusammenarbeit",
      engagementsTitle: "Drei Wege, wie wir üblicherweise starten.",
      engagementsLead:
        "Welcher es auch ist, die ersten zwei Wochen sehen gleich aus: Wir lernen die Domäne, schreiben auf, was wir gefunden haben, und sagen Ihnen, was wir denken.",
      engagements: {
        discovery: {
          name: "Discovery",
          detail:
            "Zwei bis vier Wochen, fester Umfang. Sie bekommen einen schriftlichen Plan, eine Architekturempfehlung, eine Schätzung mit ihren Annahmen und einen Prototyp für das, was das Risiko trägt. Das steht für sich, Sie können damit zu einem anderen Team gehen.",
        },
        build: {
          name: "Produktentwicklung",
          detail:
            "Ein komplettes Team aus Produkt, Design und Entwicklung, bis zum Launch und darüber hinaus. Zwei-Wochen-Iterationen gegen eine deployte Umgebung, mit Zugriff auf das Repository ab Tag eins.",
        },
        embedded: {
          name: "Eingebettetes Team",
          detail:
            "Entwicklerinnen und Designer, die in Ihrem Prozess und nach Ihren Prioritäten arbeiten und unsere Standards halten. Sinnvoll, wenn die Produktrichtung Ihre ist und die Kapazität fehlt.",
        },
      },
      studioEyebrow: "Das Studio",
      studioTitle: "Mit wem Sie tatsächlich arbeiten würden.",
      studioLead:
        "Sie arbeiten mit den Menschen, die die Arbeit machen. Zwischen Ihnen und den Entwicklern liegt keine Account-Ebene, und wer Ihr Projekt zugeschnitten hat, ist beim Launch im Gespräch dabei.",
      studio1: "Wer pitcht, baut auch",
      studio2:
        "Direkter Zugang zu Entwicklung und Design, keine weiterreichende Projektleitung",
      studio3:
        "Eine namentlich benannte Person, verantwortlich von Anfang bis Ende",
      studio4:
        "Ihr Repository, Ihre Infrastruktur, Ihre Zugänge, ab dem ersten Commit",
      studioNote:
        "Teammitglieder, Mitarbeiterzahl, Standorte und Referenzen stehen hier bewusst nicht. Tragen Sie sie in {file} und in diesem Abschnitt ein, sobald sie echt sind; sie zu erfinden wäre das Einzige, was alles andere auf dieser Seite unglaubwürdig machen würde.",
      closeTitle: "Wenn das nach Ihrer Art zu arbeiten klingt.",
      closeLead:
        "Dreißig Minuten, kein Deck. Bringen Sie das Problem mit und wir sagen Ihnen, was der Bau tatsächlich bedeutet.",
    },
    contact: {
      eyebrow: "Sprechen Sie mit uns",
      title: "Wählen Sie eine Zeit, die Ihnen passt.",
      lead: "Dreißig Minuten mit den Menschen, die es auch bauen würden. Kein Deck, kein Discovery-Honorar, keine Vertriebsserie danach.",
      orBriefTitle: "Oder beschreiben Sie Ihr Projekt",
      orBriefLead:
        "Vier Felder, und Sie können anhängen, was Sie schon haben. Schließen und zurückkommen, ohne etwas zu verlieren.",
      preferEmail: "Lieber per E-Mail",
      whatHelps: "Was uns hilft, sinnvoll zu antworten",
      whatHelps1: "Das Problem, vor der Funktionsliste",
      whatHelps2:
        "Was es heute gibt: ein System, eine Tabelle, oder noch nichts",
      whatHelps3: "Wer es nutzt, und wo diese Menschen dabei sind",
      whatHelps4: "Jedes Datum, das wirklich zählt, und warum",
      whatNext: "Wie es weitergeht",
      whatNext1:
        "Ein 30-minütiges Gespräch mit den Menschen, die es bauen würden",
      whatNext2: "Eine klare Antwort zur Passung und dazu, was es braucht",
      whatNext3:
        "Ein schriftlicher Umfang und eine Schätzung, mit den Annahmen dabei",
      whatNext4:
        "Sie entscheiden. Wir haken nicht nach, und es folgt keine Serie",
      whereWeAre: "Wo wir sind",
    },
    caseStudy: {
      moreFrom: "Mehr aus {project}",
      closeTitle: "Sie bauen etwas Ähnliches?",
      closeLead:
        "Buchen Sie dreißig Minuten und wir sagen Ihnen schnell, ob wir das richtige Team sind und was es ungefähr braucht.",
    },
  },

  site: {
    role: "Software-Haus",
    description:
      "GA Code baut Websites, Apps, SaaS-Plattformen und KI-Produkte, von der Idee bis zu etwas, das Menschen wirklich nutzen. Buchen Sie ein 30-minütiges Gespräch und bekommen Sie klare Antworten zu Umfang und Kosten.",
    keywords:
      "Softwareentwicklung|Webentwicklung|App-Entwicklung|SaaS-Entwicklung|KI-Entwicklung|Individualsoftware|Software-Haus",
    startProject: "Projekt starten",
    exploreWork: "Projekte ansehen",
    viewCaseStudy: "Fallstudie ansehen",
    viewAllWork: "Alle Projekte",
    nextProject: "Nächstes Projekt",
    backToWork: "Alle Projekte",
    industry: "Branche",
    productType: "Produkttyp",
    services: "Leistungen",
    platforms: "Plattformen",
    technology: "Technologie",
    outcome: "Ergebnis",
    whatWeDid: "Was wir gemacht haben",
    period: "Zeitraum",
    allWork: "Alle Projekte",
    filterBy: "Nach Bereich filtern",
    placeholderCaseStudy:
      "Beispielhafte Fallstudie. Projekt, Zahlen und Zitate sind Platzhalter, bis echte, freigegebene Kundenarbeit sie ersetzt.",
    placeholderMetrics:
      "Die gezeigten Zahlen sind beispielhafte Platzhalter, keine gemessenen Ergebnisse.",
    placeholderTestimonial:
      "Platzhalter, wartet auf ein freigegebenes Kundenzitat.",
    categories: {
      saas: "SaaS",
      "web-app": "Web-Apps",
      mobile: "Mobile",
      ai: "KI",
      commerce: "Commerce",
      data: "Daten",
    },
    footer: {
      tagline: "Software-Haus.",
      navigation: "Navigation",
      capabilities: "Leistungen",
      selectedWork: "Ausgewählte Projekte",
      connect: "Kontakt",
      legal: "Rechtliches",
      rights: "Alle Rechte vorbehalten.",
      builtWith: "Gebaut mit Next.js. Design und Entwicklung im Haus.",
    },
  },

  validation: {
    required: "Dieses Feld ist erforderlich",
    email: "Geben Sie eine gültige E-Mail-Adresse ein",
    minLength: "Mindestens {min} Zeichen",
    maxLength: "Höchstens {max} Zeichen",
    passwordWeak: "Mindestens 8 Zeichen, mit einem Buchstaben und einer Zahl",
    passwordMismatch: "Die Passwörter stimmen nicht überein",
    phone: "Geben Sie eine gültige Telefonnummer ein",
    url: "Geben Sie eine gültige URL ein",
    number: "Geben Sie eine Zahl ein",
  },

  errors: {
    generic: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    network: "Der Server ist nicht erreichbar. Prüfen Sie Ihre Verbindung.",
    unauthorized: "Dafür fehlt Ihnen der Zugriff.",
    notFound: "Wir konnten nicht finden, wonach Sie gesucht haben.",
    validation: "Bitte prüfen Sie die markierten Felder.",
  },
} satisfies Messages;

export default de;
