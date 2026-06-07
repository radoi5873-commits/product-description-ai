/**
 * Module de vérification et correction automatique du français.
 * 
 * Corrige :
 * - Typographie française (espaces insécables, guillemets, ponctuation)
 * - Contractions obligatoires (de le → du, de les → des, à le → au, etc.)
 * - Élisions manquantes (de + voyelle → d', le + voyelle → l')
 * - Répétitions de mots consécutifs
 * - Répétitions de débuts de phrases
 * - Doubles espaces, espaces avant ponctuation basse
 * - Capitalisation après ponctuation forte
 * - Pléonasmes et erreurs grammaticales courantes
 * - Diversification du vocabulaire (mots surreprésentés)
 */

// ─── Typographie Française ──────────────────────────────────────────────────

/** Ajoute une espace insécable fine avant : ; ! ? et après « et avant » */
const fixFrenchTypography = (text: string): string => {
  let result = text;

  // Espace insécable avant ponctuation haute (: ; ! ?)
  result = result.replace(/\s*([;:!?])/g, '\u00A0$1');

  // Guillemets français : « texte » avec espaces insécables
  result = result.replace(/«\s*/g, '«\u00A0');
  result = result.replace(/\s*»/g, '\u00A0»');

  return result;
};

// ─── Contractions Obligatoires ──────────────────────────────────────────────

/**
 * Corrige UNIQUEMENT les contractions et élisions entre mots séparés par un espace.
 * Utilise des patterns très stricts (espace ou début de chaîne) pour ne JAMAIS
 * toucher l'intérieur des mots.
 */
const fixElisions = (text: string): string => {
  let result = text;

  // === Contractions d'articles ===
  
  // "de le X" → "du X" (sauf infinitifs)
  result = result.replace(/(^|\s)de le (?!faire|voir|dire|savoir|prendre|mettre|rendre|laisser|garder)/gim,
    (_m, pre) => `${pre}du `);
  result = result.replace(/(^|\s)De le (?!faire|voir|dire|savoir|prendre|mettre|rendre|laisser|garder)/gm,
    (_m, pre) => `${pre}Du `);

  // "de les X" → "des X"
  result = result.replace(/(^|\s)de les /gim, (_m, pre) => `${pre}des `);
  result = result.replace(/(^|\s)De les /gm, (_m, pre) => `${pre}Des `);

  // "à le X" → "au X"
  result = result.replace(/(^|\s)à le /gim, (_m, pre) => `${pre}au `);
  result = result.replace(/(^|\s)À le /gm, (_m, pre) => `${pre}Au `);

  // "à les X" → "aux X"
  result = result.replace(/(^|\s)à les /gim, (_m, pre) => `${pre}aux `);
  result = result.replace(/(^|\s)À les /gm, (_m, pre) => `${pre}Aux `);

  // "de des X" → "des X" (double article)
  result = result.replace(/(^|\s)de des /gim, (_m, pre) => `${pre}des `);
  result = result.replace(/(^|\s)De des /gm, (_m, pre) => `${pre}Des `);

  // === Élisions devant voyelle (STRICT : mot séparé par espace uniquement) ===
  
  // "de un" → "d'un", "de une" → "d'une"
  result = result.replace(/(^|\s)de (un|une)(\s)/gim, (_m, pre, word, post) => `${pre}d'${word}${post}`);
  result = result.replace(/(^|\s)De (un|une)(\s)/gm, (_m, pre, word, post) => `${pre}D'${word}${post}`);

  // "de" + mot commençant par voyelle → "d'" (STRICT)
  // Ne capture que "de " suivi immédiatement d'un mot à initiale vocalique
  result = result.replace(/(^|\s)de ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gim, (_m, pre, word) => `${pre}d'${word}`);
  result = result.replace(/(^|\s)De ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gm, (_m, pre, word) => `${pre}D'${word}`);

  // "le" + mot commençant par voyelle → "l'" (STRICT : uniquement "le " comme mot isolé)
  result = result.replace(/(^|\s)le ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gim, (_m, pre, word) => {
    const exceptions = ['onze', 'onzième', 'oui'];
    if (exceptions.includes(word.toLowerCase())) return `${pre}le ${word}`;
    return `${pre}l'${word}`;
  });
  result = result.replace(/(^|\s)Le ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gm, (_m, pre, word) => {
    const exceptions = ['onze', 'onzième', 'oui'];
    if (exceptions.includes(word.toLowerCase())) return `${pre}Le ${word}`;
    return `${pre}L'${word}`;
  });

  // "la" + mot commençant par voyelle → "l'" (STRICT)
  result = result.replace(/(^|\s)la ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gim, (_m, pre, word) => {
    const exceptions = ['onze', 'onzième', 'oui'];
    if (exceptions.includes(word.toLowerCase())) return `${pre}la ${word}`;
    return `${pre}l'${word}`;
  });
  result = result.replace(/(^|\s)La ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gm, (_m, pre, word) => {
    const exceptions = ['onze', 'onzième', 'oui'];
    if (exceptions.includes(word.toLowerCase())) return `${pre}La ${word}`;
    return `${pre}L'${word}`;
  });

  // "que" + voyelle → "qu'" (STRICT)
  result = result.replace(/(^|\s)que ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gim, (_m, pre, word) => `${pre}qu'${word}`);
  result = result.replace(/(^|\s)Que ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gm, (_m, pre, word) => `${pre}Qu'${word}`);

  // "se" + voyelle → "s'" (STRICT)
  result = result.replace(/(^|\s)se ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gim, (_m, pre, word) => `${pre}s'${word}`);
  result = result.replace(/(^|\s)Se ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gm, (_m, pre, word) => `${pre}S'${word}`);

  // "ne" + voyelle → "n'" (STRICT)
  result = result.replace(/(^|\s)ne ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gim, (_m, pre, word) => `${pre}n'${word}`);
  result = result.replace(/(^|\s)Ne ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gm, (_m, pre, word) => `${pre}N'${word}`);

  // "je" + voyelle → "j'" (STRICT)
  result = result.replace(/(^|\s)je ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gim, (_m, pre, word) => `${pre}j'${word}`);
  result = result.replace(/(^|\s)Je ([aeéèêiîoôuùûyh][a-zà-ÿ]+)/gm, (_m, pre, word) => `${pre}J'${word}`);

  return result;
};

// ─── Suppression des Répétitions ────────────────────────────────────────────

/** Supprime les mots consécutifs identiques ("le le", "de de", etc.) */
const fixConsecutiveRepeats = (text: string): string => {
  // Seulement des mots courts (articles, prépositions) dupliqués par erreur
  return text.replace(/\b(le|la|les|de|du|des|un|une|et|ou|en|à|au|aux|ce|se|ne|que|qui|par|pour|sur|dans|avec|son|sa|ses)\s+\1\b/gi, '$1');
};

/** Détecte et varie les débuts de phrases répétitifs */
const fixRepeatedSentenceStarts = (text: string): string => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length < 2) return text;

  const starters = new Map<string, number>();
  const alternatives: Record<string, string[]> = {
    'Chaque': ['Tout', 'L\'ensemble des', 'La totalité des'],
    'Ce': ['Cet', 'Le', 'Un tel'],
    'Le': ['Ce', 'Notre', 'Votre'],
    'La': ['Cette', 'Notre', 'Votre'],
    'Les': ['Ces', 'Nos', 'Vos'],
    'Un': ['Ce', 'Le', 'Chaque'],
    'Une': ['Cette', 'La', 'Chaque'],
    'Il': ['Ce produit', 'Celui-ci', 'Cet article'],
    'Elle': ['Cette solution', 'Celle-ci', 'Cette création'],
    'Avec': ['Grâce à', 'Au moyen de', 'Fort de'],
    'Dans': ['Au sein de', 'À travers', 'Au cœur de'],
    'Pour': ['Afin de', 'En vue de', 'Dans le but de'],
    'En': ['Lors de', 'Au moment de', 'Durant'],
    'Conçu': ['Élaboré', 'Développé', 'Pensé'],
    'Pensé': ['Conçu', 'Imaginé', 'Créé'],
    'Découvrez': ['Explorez', 'Plongez dans', 'Laissez-vous séduire par'],
  };

  const result: string[] = [];

  for (const sentence of sentences) {
    if (!sentence.trim()) { result.push(sentence); continue; }
    const firstWord = sentence.split(/[\s''']/)[0];
    const count = starters.get(firstWord) || 0;

    if (count > 0 && alternatives[firstWord]) {
      const altPool = alternatives[firstWord];
      const alt = altPool[count % altPool.length];
      const modified = sentence.replace(new RegExp(`^${firstWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), alt);
      result.push(modified);
    } else {
      result.push(sentence);
    }

    starters.set(firstWord, count + 1);
  }

  return result.join(' ');
};

// ─── Nettoyage de la Ponctuation ────────────────────────────────────────────

/** Corrige la ponctuation et les espaces */
const fixPunctuation = (text: string): string => {
  let result = text;

  // Supprimer les doubles espaces
  result = result.replace(/ {2,}/g, ' ');

  // Supprimer les espaces avant ponctuation basse (. ,)
  result = result.replace(/\s+([.,])/g, '$1');

  // S'assurer d'un espace après ponctuation (sauf fin de chaîne et abréviations)
  result = result.replace(/([.!?,;:])([A-ZÀ-Ü])/g, '$1 $2');

  // Capitalisation après ponctuation forte (. ! ?)
  result = result.replace(/([.!?])\s+([a-zà-ü])/g, (_match, punct, letter) => {
    return `${punct} ${letter.toUpperCase()}`;
  });

  // Supprimer espace en début/fin de ligne
  result = result.split('\n').map(line => line.trim()).join('\n');

  // Supprimer les lignes vides multiples
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
};

// ─── Corrections Grammaticales Spécifiques ──────────────────────────────────

/** Corrige des erreurs grammaticales fréquentes en français */
const fixCommonGrammarErrors = (text: string): string => {
  let result = text;

  // "malgré que" → "bien que" (faute fréquente)
  result = result.replace(/\bmalgré que\b/gi, 'bien que');

  // "au jour d'aujourd'hui" → "aujourd'hui" (pléonasme)
  result = result.replace(/\bau jour d'aujourd'hui\b/gi, "aujourd'hui");

  // "voire même" → "voire" (pléonasme)
  result = result.replace(/\bvoire même\b/gi, 'voire');

  // "car en effet" → "car" (pléonasme)
  result = result.replace(/\bcar en effet\b/gi, 'car');

  // "puis ensuite" → "puis" (pléonasme)
  result = result.replace(/\bpuis ensuite\b/gi, 'puis');

  // "monter en haut" → "monter"
  result = result.replace(/\bmonter en haut\b/gi, 'monter');

  // "descendre en bas" → "descendre"
  result = result.replace(/\bdescendre en bas\b/gi, 'descendre');

  // "pallier à" → "pallier" (transitif direct)
  result = result.replace(/\bpallier à\b/gi, 'pallier');

  // "s'avérer vrai" → "s'avérer exact" (pléonasme)
  result = result.replace(/\bs'avérer vrai\b/gi, "s'avérer exact");

  // "comme par exemple" → "par exemple" (pléonasme)
  result = result.replace(/\bcomme par exemple\b/gi, 'par exemple');

  // "etc..." → "etc."
  result = result.replace(/\betc\.{2,}/gi, 'etc.');

  // Apostrophes droites → courbes (typographie française)
  result = result.replace(/'/g, '\u2019');

  return result;
};

// ─── Détection des Mots Surreprésentés ──────────────────────────────────────

/** Synonymes pour les mots trop fréquents */
const OVERUSED_SYNONYMS: Record<string, string[]> = {
  'permet': ['offre', 'donne la possibilité', 'rend possible'],
  'permettant': ['offrant', 'rendant possible', 'favorisant'],
  'très': ['particulièrement', 'remarquablement', 'extrêmement'],
  'vraiment': ['véritablement', 'réellement', 'authentiquement'],
  'important': ['essentiel', 'capital', 'crucial'],
  'aussi': ['également', 'de même', 'par ailleurs'],
  'beaucoup': ['considérablement', 'largement', 'amplement'],
  'bon': ['excellent', 'remarquable', 'de premier ordre'],
  'bonne': ['excellente', 'remarquable', 'de premier ordre'],
  'chose': ['élément', 'aspect', 'composante'],
  'choses': ['éléments', 'aspects', 'composantes'],
};

/** Remplace les mots surreprésentés par des synonymes pour plus de variété */
const diversifyVocabulary = (text: string): string => {
  let result = text;
  
  for (const [word, synonyms] of Object.entries(OVERUSED_SYNONYMS)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = result.match(regex);
    
    if (matches && matches.length > 1) {
      let count = 0;
      result = result.replace(regex, (match) => {
        count++;
        if (count > 1) {
          const synonym = synonyms[(count - 2) % synonyms.length];
          if (match[0] === match[0].toUpperCase()) {
            return synonym.charAt(0).toUpperCase() + synonym.slice(1);
          }
          return synonym;
        }
        return match;
      });
    }
  }

  return result;
};

// ─── Pipeline Principal ─────────────────────────────────────────────────────

/**
 * Applique toutes les corrections de qualité française sur un texte.
 * Pipeline : grammaire → élisions → doublons → répétitions → vocabulaire → typographie → ponctuation
 */
export const polishFrenchText = (text: string): string => {
  if (!text || text.trim() === '') return text;

  let result = text;

  // 1. Corrections grammaticales (pléonasmes, erreurs courantes)
  result = fixCommonGrammarErrors(result);

  // 2. Contractions et élisions obligatoires
  result = fixElisions(result);

  // 3. Mots consécutifs dupliqués (articles/prépositions uniquement)
  result = fixConsecutiveRepeats(result);

  // 4. Débuts de phrases répétitifs
  result = fixRepeatedSentenceStarts(result);

  // 5. Diversification du vocabulaire
  result = diversifyVocabulary(result);

  // 6. Typographie française (espaces insécables)
  result = fixFrenchTypography(result);

  // 7. Ponctuation et espaces
  result = fixPunctuation(result);

  return result;
};

/**
 * Applique le polissage sur tous les champs textuels d'un résultat de génération.
 */
export const polishGenerationResult = (result: {
  title: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  cta: string;
  seoMeta: string;
}): typeof result => {
  return {
    title: polishFrenchText(result.title),
    shortDescription: polishFrenchText(result.shortDescription),
    longDescription: polishFrenchText(result.longDescription),
    benefits: result.benefits.map(b => polishFrenchText(b)),
    cta: polishFrenchText(result.cta),
    seoMeta: polishFrenchText(result.seoMeta),
  };
};
