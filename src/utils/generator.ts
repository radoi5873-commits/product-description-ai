import type { ProductInput, GenerationResult } from '../types';

// Moteur de génération local (fallback de haute qualité)
const generateLocalDescription = (input: ProductInput): GenerationResult => {
  const { name, category, targetAudience, tone } = input;
  
  // Dictionnaires de mots selon le ton
  const toneData = {
    professional: {
      adjectives: ['fiable', 'performant', 'ergonomique', 'intuitif', 'durable', 'optimisé'],
      verbs: ['optimiser', 'garantir', 'faciliter', 'sécuriser', 'structurer', 'perfectionner'],
      seoKeywords: ['qualité professionnelle', 'efficience', 'fiabilité', 'standard élevé', 'solution'],
      intro: `Découvrez une solution conçue pour répondre aux exigences les plus strictes. Le ${name} s'intègre parfaitement dans votre quotidien pour en maximiser l'efficacité.`,
      cta: 'Commander dès maintenant'
    },
    commercial: {
      adjectives: ['révolutionnaire', 'indispensable', 'exceptionnel', 'incroyable', 'unique', 'imbattable'],
      verbs: ['booster', 'transformer', 'profiter', 'révolutionner', 'économiser', 'saisir'],
      seoKeywords: ['meilleur rapport qualité-prix', 'offre spéciale', 'tendance e-commerce', 'must-have'],
      intro: `Ne manquez pas l'opportunité de transformer votre quotidien avec le ${name}. Conçu pour dépasser vos attentes, c'est le choix idéal pour ceux qui veulent le meilleur sans compromis.`,
      cta: 'Profiter de l\'offre'
    },
    luxury: {
      adjectives: ['prestigieux', 'raffiné', 'd\'exception', 'intemporel', 'exclusif', 'somptueux'],
      verbs: ['sublimer', 'incarner', 'révéler', 'magnifier', 'distinguer', 'savourer'],
      seoKeywords: ['haut de gamme', 'luxe', 'artisanat d\'art', 'édition limitée', 'prestige'],
      intro: `L'excellence se cache dans les détails. Avec le ${name}, faites l'expérience du raffinement absolu et d'un savoir-faire unique, taillé pour les connaisseurs les plus exigeants.`,
      cta: 'Acquérir cette pièce'
    },
    dynamic: {
      adjectives: ['ultra-rapide', 'puissant', 'futuriste', 'audacieux', 'connecté', 'vibrant'],
      verbs: ['propulser', 'dynamiser', 'explorer', 'dépasser les limites', 'libérer', 'activer'],
      seoKeywords: ['innovation', 'haute performance', 'nouvelle génération', 'vitesse', 'style de vie'],
      intro: `Prêt à passer au niveau supérieur ? Le ${name} débarque avec un design audacieux et des fonctionnalités de pointe pour propulser vos sessions et votre style de vie.`,
      cta: 'Rejoindre l\'aventure'
    }
  };

  const selectedTone = toneData[tone] || toneData.professional;

  // Création des titres accrocheurs selon le ton
  const titles = {
    professional: `${name} - Efficacité Professionnelle & Qualité Supérieure`,
    commercial: `${name} : La Révolution E-Commerce dont vous ne pourrez plus vous passer`,
    luxury: `${name} | L'Élégance Intemporelle et le Prestige de l'Exception`,
    dynamic: `${name} - Libérez votre Potentiel avec l'Innovation Nouvelle Génération`
  };

  const title = titles[tone] || `${name} - ${category}`;

  // Description courte
  const shortDescription = `Le ${name} est le choix idéal pour ${targetAudience} à la recherche d'un produit ${selectedTone.adjectives[0]} et ${selectedTone.adjectives[1]}. Pensé spécifiquement pour la catégorie ${category}, il permet de ${selectedTone.verbs[0]} votre quotidien en toute simplicité. Une conception innovante qui allie ${selectedTone.seoKeywords[0]} et ergonomie pour un résultat impeccable.`;

  // Description longue
  const longDescription = `Conçu avec une attention méticuleuse portée aux détails, le ${name} s'impose comme une référence incontournable dans le domaine ${category}. Que vous soyez novice ou utilisateur chevronné, ce produit saura s'adapter à vos besoins spécifiques. Sa structure robuste garantit une durabilité maximale tandis que ses finitions élégantes complètent son esthétique globale.

Dans un marché saturé de solutions temporaires, notre produit se distingue par une approche centrée sur l'utilisateur. Chaque fonction a été rigoureusement testée pour ${selectedTone.verbs[1]} vos performances et vous offrir une expérience fluide au quotidien. En choisissant le ${name}, vous optez pour la sérénité d'un outil pensé par des experts pour un public de ${targetAudience}.

Enfin, l'optimisation de ce produit garantit un impact minimal sur votre temps tout en décuplant les résultats. Rejoignez la communauté des utilisateurs satisfaits qui ont choisi de franchir le pas. C'est l'investissement parfait pour allier modernité, ${selectedTone.seoKeywords[1]} et efficacité sans aucun compromis.`;

  // 5 Avantages
  const benefits = [
    `Conception Ergonomique : Pensé pour réduire l'effort et s'adapter parfaitement à l'utilisateur (${targetAudience}).`,
    `Performance Optimisée : Équipé de technologies permettant de ${selectedTone.verbs[2]} les résultats en un temps record.`,
    `Matériaux Durables : Fabriqué selon des normes élevées pour assurer un usage quotidien fiable à long terme.`,
    `Polyvalence Inégalée : S'adapte à de multiples contextes de la catégorie ${category} en toute simplicité.`,
    `Garantie de Satisfaction : Un service client à l'écoute et une qualité certifiée pour un achat en toute confiance.`
  ];

  // Meta Description SEO
  const seoMeta = `Découvrez le ${name} pour ${targetAudience}. Un produit ${selectedTone.adjectives[2]} de la catégorie ${category} conçu pour ${selectedTone.verbs[3]} vos activités. Achetez le vôtre dès aujourd'hui !`;

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    timestamp: Date.now(),
    input,
    title,
    shortDescription,
    longDescription,
    benefits,
    cta: selectedTone.cta,
    seoMeta
  };
};

// Fonction de génération principale (Gemini API ou Local Fallback)
export const generateProductDescription = async (
  input: ProductInput,
  apiKey?: string
): Promise<GenerationResult> => {
  if (!apiKey || apiKey.trim() === '') {
    // Mode local simulé avec délai pour une expérience réaliste
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return generateLocalDescription(input);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Tu es un expert en e-commerce et en copywriting SEO. Génère une fiche produit professionnelle de haute qualité en français pour le produit suivant :
                  - Nom du produit : ${input.name}
                  - Catégorie : ${input.category}
                  - Public cible : ${input.targetAudience}
                  - Ton du texte : ${input.tone} (Options : professional, commercial, luxury, dynamic)

                  Consignes de génération :
                  - Le titre doit être accrocheur et contenir des mots-clés SEO clés.
                  - La description courte doit faire 2 à 3 phrases percutantes et accrocheuses.
                  - La description longue doit faire environ 3 paragraphes structurés et engageants, expliquant en quoi le produit répond aux besoins du public cible.
                  - Les 5 avantages principaux doivent être rédigés sous la forme "Titre court : Explication claire".
                  - Le Call To Action (CTA) doit être court et incitatif (ex: "Ajouter au panier", "Découvrir la collection").
                  - La Meta Description SEO doit faire moins de 160 caractères et être optimisée pour le taux de clic sur Google.

                  Tu DOIS retourner UNIQUEMENT un objet JSON valide (sans mise en forme de bloc de code markdown, ou alors enveloppé dans un bloc \`\`\`json et \`\`\`) avec cette structure exacte :
                  {
                    "title": "...",
                    "shortDescription": "...",
                    "longDescription": "...",
                    "benefits": ["...", "...", "...", "...", "..."],
                    "cta": "...",
                    "seoMeta": "..."
                  }`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Gemini a renvoyé une erreur : ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Réponse vide de l'API Gemini.");
    }

    // Extraction et parsing du JSON
    let cleanJsonText = textResponse.trim();
    if (cleanJsonText.startsWith('```')) {
      // Nettoyage si entouré de blocs markdown
      cleanJsonText = cleanJsonText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanJsonText);

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      input,
      title: parsedData.title || `${input.name} - ${input.category}`,
      shortDescription: parsedData.shortDescription || '',
      longDescription: parsedData.longDescription || '',
      benefits: Array.isArray(parsedData.benefits) && parsedData.benefits.length === 5 
        ? parsedData.benefits 
        : [
            "Avantage 1 : Excellente qualité globale.",
            "Avantage 2 : Conçu pour répondre aux besoins.",
            "Avantage 3 : Matériaux de choix et durabilité.",
            "Avantage 4 : Excellent rapport qualité-prix.",
            "Avantage 5 : Satisfaction client garantie."
          ],
      cta: parsedData.cta || 'Commander maintenant',
      seoMeta: parsedData.seoMeta || ''
    };
  } catch (error) {
    console.error("Erreur lors de la génération avec l'API Gemini, bascule sur la génération locale.", error);
    // En cas d'erreur de clé, de réseau ou de parsing, on bascule de façon transparente sur la génération locale intelligente
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateLocalDescription(input);
  }
};
