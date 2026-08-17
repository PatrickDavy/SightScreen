/** S32 metric explainers — what it is, why it links to speed, how it is
 *  measured here, the measurement's limitations, and the research citation.
 *  The research summary is a product surface, not a footnote. */
import { DETERMINANTS } from './determinants';

export interface Explainer {
  whatItIs: string;
  whyItLinks: string;
  howMeasured: string;
  limitations: string;
  research: string;
}

const HOW_MEASURED =
  'Pose estimation on your 240 fps clip, read at the release frame. The ± band is the model’s uncertainty on your video — light, angle and distance move it.';

const LIMITATIONS =
  'A single side-on phone view can’t see everything; small angle errors are expected. Low-confidence deliveries are flagged and left out of trends, never silently included.';

const RESEARCH: Record<string, string> = {
  knee: 'Portus et al. (2004), J Sports Sci — front-leg kinematics and release speed. Summarised in plain language; the full citation list is in Settings.',
  runup: 'Worthington et al. (2013), J Appl Biomech — approach speed and ball release speed. Summarised in plain language; the full citation list is in Settings.',
  delay: 'Ferdinands et al. (2013), Sports Biomech — segment sequencing in fast bowling. Summarised in plain language; the full citation list is in Settings.',
  trunk: 'Portus et al. (2004), J Sports Sci — trunk kinematics, speed and back injury risk. Summarised in plain language; the full citation list is in Settings.',
};

export function explainerFor(key: string): Explainer | null {
  const d = DETERMINANTS[key];
  if (!d) return null;
  return {
    whatItIs: d.mean,
    whyItLinks: `${d.ref}. The correlation is one of the few consistent findings across fast-bowling studies.`,
    howMeasured: HOW_MEASURED,
    limitations: LIMITATIONS,
    research: RESEARCH[key] ?? RESEARCH.knee!,
  };
}
