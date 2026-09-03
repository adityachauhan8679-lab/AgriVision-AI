import { Request, Response } from 'express';
import { db } from '../db.js';
import { IAiAnalysisResult, ILeafDiseaseDiagnosis, IZoneRecommendation } from '../models.js';
import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch {
      geminiClient = null;
    }
  }
  return geminiClient;
}

export const runFarmAnalysis = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.body;
    const farm = db.farms.find(f => f.id === farmId) || db.farms[0];
    const zones = db.zones[farm.id] || db.zones['farm_001'] || [];
    const sensors = db.sensorReadings[farm.id] || db.sensorReadings['farm_001'];
    const weather = db.weatherData[farm.id] || db.weatherData['farm_001'];
    const satellite = (db.satelliteObservations[farm.id] || db.satelliteObservations['farm_001'] || [])[3];

    // Compute zone-specific analytics mathematically based on zone health and moisture
    const zonesAnalysis: IZoneRecommendation[] = zones.map(z => {
      let action = 'No action required';
      let rec = 'Vegetation index is optimum. Continue standard scouting.';
      let urgency: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      let irrigationLiters = 0;
      let fertilizer = 'No supplementary nutrients needed';

      if (z.healthStatus === 'SEVERE_STRESS' || z.soilMoisture < 25) {
        action = 'Urgent deep irrigation required';
        rec = `Critically low moisture (${z.soilMoisture}%). Soil water depletion threatens cell turgor. Deliver 20–25mm targeted saturation immediately.`;
        urgency = 'HIGH';
        irrigationLiters = Math.round(z.areaAcres * 450);
        fertilizer = 'Withhold nitrogen; apply seaweed extract biostimulant once rehydrated';
      } else if (z.healthStatus === 'MODERATE_STRESS' || z.soilMoisture < 35) {
        action = 'Moderate supplemental irrigation within 18 hours';
        rec = `Moisture is below target (${z.soilMoisture}% vs 40% optimal). Schedule evening pulse cycle to minimize evaporation.`;
        urgency = 'MEDIUM';
        irrigationLiters = Math.round(z.areaAcres * 220);
        fertilizer = 'Maintain balanced N-P-K fertigation';
      } else {
        action = 'Optimal vigor - Continue standard monitoring';
        rec = `Canopy is thriving (Health Score: ${z.healthScore}/100). Zero water deficit detected.`;
        urgency = 'LOW';
        irrigationLiters = 0;
        fertilizer = 'Foliar micronutrient maintenance only';
      }

      return {
        zoneId: z.zoneId,
        zoneName: z.name,
        healthScore: z.healthScore,
        action,
        recommendation: rec,
        urgency,
        irrigationVolumeLiters: irrigationLiters,
        fertilizerAdjustment: fertilizer
      };
    });

    // Calculate aggregated farm score
    const avgScore = Math.round(zones.reduce((sum, z) => sum + z.healthScore, 0) / (zones.length || 1));
    const lowestZone = zones.find(z => z.healthStatus === 'SEVERE_STRESS');
    const moderateZone = zones.find(z => z.healthStatus === 'MODERATE_STRESS');

    const waterStress = lowestZone ? 'Moderate' : moderateZone ? 'Mild' : 'Optimal';
    const diseaseRisk = Math.round(
      (weather.humidity > 65 ? 18 : 8) + (lowestZone ? 12 : 0) + (Math.random() * 4)
    );
    const pestRisk: 'Low' | 'Moderate' | 'High' = weather.currentTemp > 28 ? 'Moderate' : 'Low';

    const totalIrrigationLiters = zonesAnalysis.reduce((acc, curr) => acc + curr.irrigationVolumeLiters, 0);

    const overallRecommendation = lowestZone
      ? `${lowestZone.zoneId} exhibits acute localized moisture stress (${lowestZone.soilMoisture}%). Focus ${totalIrrigationLiters.toLocaleString()}L exclusively on stressed zones to save up to 65% water compared to uniform whole-field irrigation. ${weather.agriculturalImpact}`
      : `Crop condition is favorable across all management zones. Maintain precision drip schedule and hold back field-wide fertilizer.`;

    const analysisResult: IAiAnalysisResult = {
      id: `anl_${Date.now()}`,
      farmId: farm.id,
      createdAt: new Date().toISOString(),
      cropHealthScore: avgScore,
      diseaseRisk,
      waterStress,
      nutrientStress: lowestZone ? 'Nitrogen Deficiency' : 'Balanced',
      pestRisk,
      irrigationRequirement: totalIrrigationLiters > 0 ? `${totalIrrigationLiters.toLocaleString()} Liters (Targeted)` : '0 Liters (Optimal)',
      fertilizerRecommendation: 'Zone-variable: Omit Zone 1; Apply foliar potassium & zinc to stressed patches.',
      expectedYieldHectare: `${(5.5 + (avgScore / 100) * 2.2).toFixed(1)} Tonnes / Ha (${avgScore > 75 ? '+14% above' : '-6% below'} regional baseline)`,
      overallRecommendation,
      confidenceScore: 94,
      zonesAnalysis
    };

    // Save to database
    if (!db.analyses[farm.id]) {
      db.analyses[farm.id] = [];
    }
    db.analyses[farm.id].unshift(analysisResult);

    // Also update farm overall health
    farm.overallHealthScore = avgScore;

    return res.json({
      success: true,
      message: 'AI Precision Analysis calculated successfully',
      analysis: analysisResult,
      isDemoRuleEngine: true
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'AI Analysis error', error: String(err) });
  }
};

export const detectCropDisease = async (req: Request, res: Response) => {
  try {
    const { imageBase64, sampleType, cropType } = req.body;

    // Library of realistic crop diagnoses for demo and fallback
    const mockDiagnoses: Record<string, ILeafDiseaseDiagnosis> = {
      'leaf_rust': {
        diseaseName: 'Puccinia graminis (Leaf Stripe Rust)',
        confidence: 94.6,
        severity: 'Moderate',
        pathogenType: 'Fungal',
        symptoms: [
          'Linear stripes of bright yellow to orange pustules along leaf veins',
          'Chlorotic striping followed by localized leaf necrosis',
          'Premature desiccation of upper flag leaves reducing grain fill'
        ],
        recommendedAction: 'Apply triazole or strobilurin-based fungicide (e.g., Tebuconazole 250 EC at 1.0 L/ha) targeted only to affected management zones.',
        fungicidePesticide: 'Tebuconazole 250 EC or Azoxystrobin (200g a.i./ha)',
        preventiveMeasures: [
          'Scout downwind field edges for primary inoculum foci',
          'Avoid excessive late-season nitrogen applications which promote lush susceptible tissue',
          'Select rust-resistant cultivars in next rotation cycle'
        ],
        isDemo: true
      },
      'powdery_mildew': {
        diseaseName: 'Blumeria graminis (Powdery Mildew)',
        confidence: 91.8,
        severity: 'Mild',
        pathogenType: 'Fungal',
        symptoms: [
          'Superficial white talcum powder-like fungal patches on upper leaf surface',
          'Yellowing of leaf tissue beneath the powdery fungal colonies',
          'Gradual premature senescence of lower canopy leaves'
        ],
        recommendedAction: 'Canopy humidity is elevated. Increase air circulation through selective trimming and spot-spray with sulfur or biological Bacillus subtilis.',
        fungicidePesticide: 'Micronized Sulfur 80% WP (2.5 kg/ha) or Serenade ASO (Bacillus subtilis)',
        preventiveMeasures: [
          'Reduce planting density in low-lying microclimate depressions',
          'Ensure drip lines do not cause prolonged standing surface moisture',
          'Apply silica-based foliar spray to strengthen epidermal cell walls'
        ],
        isDemo: true
      },
      'northern_corn_leaf_blight': {
        diseaseName: 'Setosphaeria turcica (Northern Corn Leaf Blight)',
        confidence: 89.4,
        severity: 'Moderate',
        pathogenType: 'Fungal',
        symptoms: [
          'Long, elliptical grayish-green or tan lesions (2.5 to 15 cm long)',
          'Lesions develop parallel to leaf margins',
          'Dark fungal sporulation visible during damp mornings'
        ],
        recommendedAction: 'Apply targeted strobilurin/triazole fungicide prior to tassel emergence if lesion threshold exceeds 10% on ear leaf.',
        fungicidePesticide: 'Pyraclostrobin + Fluxapyroxad blend (Priaxor @ 0.3 L/ha)',
        preventiveMeasures: [
          'Crop residue management: shred previous corn stalks to expedite decomposition',
          'Two-year crop rotation with non-host legumes (Soybeans/Alfalfa)',
          'Adopt resistant hybrid seed varieties with Ht gene resistance'
        ],
        isDemo: true
      },
      'healthy': {
        diseaseName: 'Healthy Foliage (No Pathogen Detected)',
        confidence: 97.2,
        severity: 'None',
        pathogenType: 'Healthy',
        symptoms: [
          'Vibrant deep green coloration indicating optimal chlorophyll-a concentration',
          'Intact cuticle and absence of chlorosis, necrosis, or fungal mycelium',
          'Healthy cell turgidity and uniform vein structure'
        ],
        recommendedAction: 'No chemical intervention required. Continue current precision water and nutrient management.',
        fungicidePesticide: 'None (Save $45/acre in unneeded chemical costs)',
        preventiveMeasures: [
          'Maintain regular IoT soil moisture monitoring',
          'Continue bi-weekly satellite NDVI index tracking',
          'Routine perimeter scouting'
        ],
        isDemo: true
      }
    };

    // If a sampleType was picked, return its detailed diagnosis
    if (sampleType && mockDiagnoses[sampleType]) {
      return res.json({
        success: true,
        diagnosis: mockDiagnoses[sampleType]
      });
    }

    // If user uploaded an image and Gemini API is available, we can analyze the real image!
    const gemini = getGeminiClient();
    if (gemini && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an expert plant pathologist and precision agriculture agronomist. 
Analyze this crop leaf image for any plant disease, nutritional deficiency, pest damage, or verify if it is healthy.
Crop context: ${cropType || 'General Field Crop'}.

Return your response strictly as valid JSON matching this structure:
{
  "diseaseName": "Scientific and common disease name (or Healthy Foliage)",
  "confidence": 92.5,
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "pathogenType": "Fungal" | "Bacterial" | "Viral" | "Pest Infestation" | "Healthy",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "recommendedAction": "Actionable treatment instructions for the farmer",
  "fungicidePesticide": "Recommended specific active ingredient or organic remedy",
  "preventiveMeasures": ["Measure 1", "Measure 2", "Measure 3"]
}`
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64
                  }
                }
              ]
            }
          ]
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            success: true,
            diagnosis: {
              ...parsed,
              isDemo: false
            }
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini vision analysis failed, falling back to rule engine:', geminiErr);
      }
    }

    // Default intelligent diagnostic match
    const selected = mockDiagnoses['leaf_rust'];
    return res.json({
      success: true,
      diagnosis: selected
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Disease detection error', error: String(err) });
  }
};
