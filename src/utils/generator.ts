import type { ProductInput, GenerationResult, ProviderOption } from '../types';
import { polishGenerationResult } from './frenchQuality';

// ─── Main Generation Function (OpenAI API or Google Gemini API) ──────────────

export const generateProductDescription = async (
  input: ProductInput,
  provider: ProviderOption,
  apiKey: string
): Promise<GenerationResult> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(`Clé API ${provider === 'openai' ? 'OpenAI' : 'Gemini'} manquante ou non configurée.`);
  }

  const systemPrompt = `Tu es un rédacteur e-commerce expert spécialisé en copywriting SEO francophone.

RÈGLES DE RÉDACTION STRICTES :
- Tu rédiges des fiches produits uniques, naturelles et professionnelles.
- Tu ne répètes jamais les mêmes phrases ou structures d'une section à l'autre.
- Tu adaptes ton style au produit, à la catégorie et au public cible.
- Tu écris dans un français impeccable avec une grammaire irréprochable et tu corriges discrètement toutes les fautes d'orthographe ou de frappe présentes dans les données d'entrée (par exemple, "Mntre" doit être écrit "Montre", "Smplifiez" doit être écrit "Simplifiez").
- Tu évites les généralités, les clichés et les textes vagues.
- Tu mets en avant les bénéfices réels et concrets du produit.
- Tu génères un contenu optimisé pour la vente ET le référencement SEO.
- Chaque section doit avoir sa propre voix et apporter une valeur distincte.

PRODUIT À RÉDIGER :
- Nom : ${input.name}
- Catégorie : ${input.category}
- Public cible : ${input.targetAudience}
- Ton : ${input.tone} (professional = précis/factuel, commercial = persuasif/accrocheur, luxury = raffiné/exclusif, dynamic = percutant/moderne)

CONSIGNES DE GÉNÉRATION :
1. TITRE : Accrocheur, contenant des mots-clés SEO pertinents. Max 80 caractères.
2. DESCRIPTION COURTE : 2-3 phrases percutantes qui donnent immédiatement envie. Pas de répétition du titre.
3. DESCRIPTION LONGUE : 3 paragraphes structurés et engageants. Chaque paragraphe a un angle différent (produit, expérience utilisateur, engagement/investissement).
4. AVANTAGES : Exactement 5, format "Titre Court : Explication claire et spécifique". Pas de formulations génériques.
5. CTA : Court et incitatif, adapté au ton choisi.
6. META SEO : Moins de 160 caractères, optimisée pour le taux de clic Google.

Retourne UNIQUEMENT un objet JSON valide avec cette structure :
{
  "title": "...",
  "shortDescription": "...",
  "longDescription": "...",
  "benefits": ["...", "...", "...", "...", "..."],
  "cta": "...",
  "seoMeta": "..."
}
Ne retourne rien d'autre que du JSON. Pas de balises markdown de bloc de code, pas d'explication.`;

  if (provider === 'openai') {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: systemPrompt
            }
          ],
          response_format: { type: 'json_object' }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        // Ignorer
      }
      const message = parsedError?.error?.message || errorText;
      throw new Error(`Erreur OpenAI : ${message}`);
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) {
      throw new Error("Réponse vide de l'API OpenAI.");
    }

    const parsedData = safeParseJSON(textResponse);
    return buildPolishedResult(input, parsedData);
  } else if (provider === 'anthropic') {
    // Anthropic Messages API
    const response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-html-headers': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: systemPrompt
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        // Ignorer
      }
      const message = parsedError?.error?.message || errorText;
      throw new Error(`Erreur Anthropic : ${message}`);
    }

    const data = await response.json();
    const textResponse = data.content?.[0]?.text;

    if (!textResponse) {
      throw new Error("Réponse vide de l'API Anthropic.");
    }

    const parsedData = safeParseJSON(textResponse);
    return buildPolishedResult(input, parsedData);
  } else {
    // Google Gemini API (v1beta Endpoint - gemini-3.5-flash)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        // Ignorer
      }
      const message = parsedError?.error?.message || errorText;
      throw new Error(`Erreur Gemini : ${message}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Réponse vide de l'API Gemini.");
    }

    const parsedData = safeParseJSON(textResponse);
    return buildPolishedResult(input, parsedData);
  }
};

// Parse JSON response safely, removing markdown code blocks if present
function safeParseJSON(textResponse: string): any {
  let cleanedText = textResponse.trim();
  if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '');
  }
  return JSON.parse(cleanedText.trim());
}

// Helper function to build polished result
const buildPolishedResult = (input: ProductInput, parsedData: any): GenerationResult => {
  const rawFields = {
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

  const polished = polishGenerationResult(rawFields);

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    timestamp: Date.now(),
    input,
    ...polished
  };
};
