# SDS Workforce — Prototyp

Ein klickbarer Prototyp einer SaaS-Plattform für Personalverwaltung und Eventplanung.
Implementiert das SDS Design System (Prototype Base).

## Voraussetzungen

- **Node.js** 18 oder neuer ([Download](https://nodejs.org/))
- ein Browser (Chrome / Edge / Safari empfohlen für Spracheingabe)

## Installation und Start

In einem Terminal in diesen Ordner wechseln und ausführen:

```bash
npm install
npm run dev
```

Der Prototyp läuft dann unter **http://localhost:5173** und öffnet sich automatisch im Browser.

## Was kann der Prototyp

- **Dashboard** — Übersicht über Veranstaltungen, offene Positionen, Hinweise, Aktivität
- **Veranstaltungen** — Listenansicht aller Events mit Besetzungsstand
- **Einsatzplanung** — Drag & Drop von Mitarbeitern auf Rollen, Qualifikationsprüfung
- **Mitarbeiter** — Stammdaten mit Detailansicht und Bewertungen
- **Bewerber-Pipeline** — Kanban-Board mit Drag & Drop
- **Zeiterfassung** — Stempeluhr (mobil-optimiert) und Zeitnachweis-Freigabe
- **Kontakte** — CRM-Karten für Kunden

### AI-Assistent (unten rechts)

- Klick auf den Sparkles-Button öffnet das Chat-Panel
- **Tippen oder sprechen** (Mikrofon-Button, Chrome / Edge / Safari)
- Versteht z.B.:
  - "Lukas hat heute von 8 bis 14 Uhr auf der Messe gearbeitet"
  - "Weise Tobias dem Public Viewing zu"
  - "Neue Bewerbung von Anna Krause als Servicekraft aus Tübingen"
- Schlägt strukturierte Datenerfassung vor, bestätigen → springt ins richtige Modul

> **Hinweis:** Der AI-Teil nutzt aktuell eine regelbasierte Mock-NLU
> (`parseIntent()` in `src/App.jsx`). Hier kann später ein echter LLM-Call
> rein (Claude API o.ä.). Das Rückgabeformat ist bereits LLM-tauglich.

## Aufbau

```
sds-workforce/
├── index.html              ← Vite Entry, lädt Inter-Font
├── package.json            ← Abhängigkeiten
├── vite.config.js          ← Vite-Konfiguration
├── tailwind.config.js      ← Tailwind-Konfiguration
├── postcss.config.js
└── src/
    ├── main.jsx            ← React Mount Point
    ├── index.css           ← Tailwind Imports
    └── App.jsx             ← KOMPLETTE APP (Design System,
                              Datenmodell, alle Screens, AI-Assistent)
```

Alles in **einer Datei** (`App.jsx`) zu halten ist Absicht für den Prototyp:
einfacher zu verstehen, einfacher zu teilen. Vor Produktiv-Setup auf
mehrere Module/Komponenten aufteilen.

## Design System

Alle Farben, Abstände, Radien werden in einem zentralen `TOKENS`-Objekt
ganz oben in `src/App.jsx` verwaltet. Änderungen am Design System dort
einmal eintragen — greifen automatisch überall.

```js
const TOKENS = {
  navy: "#0B3A6E",       // primary.main
  red: "#E30613",        // accent (nur für Aktionen/Highlights)
  ...
};
```

## Build für Produktion

```bash
npm run build
```

Erzeugt einen optimierten Build im Ordner `dist/`, der auf jedem
statischen Webserver ausgeliefert werden kann.

## Nächste Schritte

1. SDS-Logo als SVG einbauen (Komponente `SdsLogo` in `App.jsx`)
2. Mock-Daten durch echte API ersetzen (Konstanten `PEOPLE`, `EVENTS`,
   `APPLICANTS`, `CONTACTS`, `TIMERECORDS` ganz oben in `App.jsx`)
3. `parseIntent()` durch echten LLM-Call ersetzen
4. Authentifizierung / Benutzer-Rollen
5. App in mehrere Dateien aufsplitten (eine Komponente pro Datei)
