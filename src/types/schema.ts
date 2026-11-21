export type Language = 'id' | 'en';

export type SimulatorTabKey = 'desktop' | 'library' | 'clock' | 'settings' | 'taskbar' | 'telemetry';
export type TelemetryStateKey = 'tray' | 'openPanel' | 'cached' | 'paused';

export interface TelemetryStateSpec {
  label: string;
  versionTag: string;
  ram: string;
  cpu: string;
  disk: string;
  net: string;
  caption: string;
  alt: string;
  imageBase: string;
  width: number;
  height: number;
}

export interface Translation {
  nav: {
    simulator: string;
    features: string;
    benchmark: string;
    download: string;
    support: string;
    downloadBtn: string;
    supportBtn: string;
    docs: string;
    skipToContent: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    metaInfo: string;
    stat1: string;
    stat1Sub: string;
    stat2: string;
    stat2Sub: string;
    stat3: string;
    stat3Sub: string;
  };
  simulator: {
    title: string;
    subtitle: string;
    tag: string;
    sourceLink: string;
    desktopTag: string;
    desktopBadge: string;
    videoUnsupported: string;
    inspectFull: string;
    closeLightbox: string;
    soundOff: string;
    soundOn: string;
    tabs: Record<SimulatorTabKey, string>;
    tags: Record<Exclude<SimulatorTabKey, 'telemetry'>, string>;
    alts: Record<Exclude<SimulatorTabKey, 'telemetry'>, string>;
    captions: Record<SimulatorTabKey, { title: string; desc: string }>;
    telemetryStates: Record<TelemetryStateKey, TelemetryStateSpec>;
    telemetryMetricsLabel: {
      ram: string;
      cpu: string;
      disk: string;
      net: string;
    };
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    featuredBadge: string;
    items: {
      f1Title: string;
      f1Desc: string;
      f1Tags: string[];
      f2Title: string;
      f2Desc: string;
      f2Tags: string[];
      f3Title: string;
      f3Desc: string;
      f4Title: string;
      f4Desc: string;
      f5Title: string;
      f5Desc: string;
      f6Title: string;
      f6Desc: string;
    };
  };
  benchmark: {
    badge: string;
    title: string;
    subtitle: string;
    compare: {
      badge: string;
      title: string;
      subtitle: string;
      beforeLabel: string;
      afterLabel: string;
      beforeMetric: string;
      afterMetric: string;
      deltaBadge: string;
      sliderAriaLabel: string;
      presetBefore: string;
      presetSplit: string;
      presetAfter: string;
      beforeAlt: string;
      afterAlt: string;
    };
    stateCol: string;
    ramCol: string;
    cpuCol: string;
    notesCol: string;
    contextTitle: string;
    rows: {
      state: string;
      ram: string;
      ramMb: number;
      cpu: string;
      notes: string;
      highlight?: 'accent' | 'subtle';
    }[];
    disclaimer: string;
  };
  download: {
    badge: string;
    title: string;
    subtitle: string;
    wpTitle: string;
    wpDesc: string;
    wpIconAlt: string;
    wpChecklist: string[];
    wpCompatibility: string;
    tbTitle: string;
    tbDesc: string;
    tbIconAlt: string;
    tbStartup: string;
    tbCompatibility: string;
    installerBtn: string;
    portableBtn: string;
    wpChecksumBtn: string;
    sourceBtn: string;
    requirements: string;
    checksumNote: string;
    downloadsSoFar: string;
    latest: string;
    latestRelease: string;
    version: string;
    about: string;
    releaseLoading: string;
    releaseUnavailable: string;
    downloadsUnavailable: string;
    seeGithub: string;
    signingTitle: string;
    signingSummary: string;
    signingDetails: string;
    signingSteps: { label: string; text: string }[];
    privacyTitle: string;
    privacyIntro: string;
    privacyWpLabel: string;
    privacyWpText: string;
    privacyTbLabel: string;
    privacyTbText: string;
  };
  support: {
    badge: string;
    title: string;
    subtitle: string;
    desc: string;
    yappDesc: string;
    saweriaDesc: string;
    yappBtn: string;
    saweriaBtn: string;
    guarantee: string;
  };
  faq: {
    badge: string;
    title: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  footer: {
    rights: string;
    byDeveloper: string;
    licensedUnder: string;
    openSourcePromise: string;
  };
}
