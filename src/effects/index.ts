import shake from './shake';
import glitchOverlay from './glitch-overlay';
import noise from './noise';
import flashOverlay from './flash-overlay';
import popup from './popup';
import textScramble from './text-scramble';
import confetti from './confetti';
import zoomFlicker from './zoom-flicker';
import fakeError from './fake-error';
import matrixRain from './matrix-rain';
import rgbSplit from './rgb-split';
import vhsDistortion from './vhs-distortion';
import screenCrack from './screen-crack';
import pixelDissolve from './pixel-dissolve';
import screenMelt from './screen-melt';
import crtShutdown from './crt-shutdown';
import bsod from './bsod';
import fakeUpdate from './fake-update';
import fakeTerminal from './fake-terminal';
import clippy from './clippy';
import fakeVirusScan from './fake-virus-scan';
import fakeCrash from './fake-crash';
import gravity from './gravity';
import elementShuffle from './element-shuffle';
import elementScatter from './element-scatter';
import magneticCursor from './magnetic-cursor';
import tinyGiant from './tiny-giant';
import cursorChaos from './cursor-chaos';
import cursorDrift from './cursor-drift';
import autoTypo from './auto-typo';
import delayedClicks from './delayed-clicks';
import invertedScroll from './inverted-scroll';
import screenFlip from './screen-flip';
import drunkMode from './drunk-mode';
import type { ChaosEffect } from '../core/types';

export const ALL_EFFECTS: ChaosEffect[] = [
  shake,
  glitchOverlay,
  noise,
  flashOverlay,
  popup,
  textScramble,
  confetti,
  zoomFlicker,
  fakeError,
  matrixRain,
  rgbSplit,
  vhsDistortion,
  screenCrack,
  pixelDissolve,
  screenMelt,
  crtShutdown,
  bsod,
  fakeUpdate,
  fakeTerminal,
  clippy,
  fakeVirusScan,
  fakeCrash,
  gravity,
  elementShuffle,
  elementScatter,
  magneticCursor,
  tinyGiant,
  cursorChaos,
  cursorDrift,
  autoTypo,
  delayedClicks,
  invertedScroll,
  screenFlip,
  drunkMode,
];
