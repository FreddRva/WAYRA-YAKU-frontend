export function getSensorField(sensorId: string): string {
  const m: any = { 
    'temperatura': 'temperatura', 
    'humedad': 'humedad', 
    'piso': 'piso_analogico', 
    'tds': 'tds', 
    'agua': 'agua_analogico', 
    'caudal': 'caudal' 
  };
  return m[sensorId] || '';
}

export function getSensorTendency(aiData: any, sensorField: string): string {
  if (!aiData || !aiData.layer_1_analysis?.future_prediction?.tendencias) return '';
  return aiData.layer_1_analysis.future_prediction.tendencias[sensorField] || '';
}

export function filterAnomaliesBySensor(aiData: any, sensorField: string): any[] {
  if (!aiData?.layer_1_analysis?.anomalies) return [];
  return aiData.layer_1_analysis.anomalies.filter((a: any) => {
    const type = a.type.toLowerCase();
    if (sensorField === 'temperatura') return type.includes('temperatura');
    if (['piso_analogico', 'agua_analogico', 'caudal'].includes(sensorField)) return type.includes('suministro') || type.includes('falla') || type.includes('agua');
    if (sensorField === 'tds') return type.includes('tds') || type.includes('calidad');
    return true;
  });
}

export function filterRecommendationsBySensor(aiData: any, sensorField: string): string[] {
  if (!aiData?.layer_3_prescription) return [];
  const all = aiData.layer_3_prescription;
  if (all.length === 0) return [];
  
  const filtered = all.filter((r: string) => {
    const rec = r.toLowerCase();
    if (rec.includes('mantener') || rec.includes('parada de emergencia')) return true;
    if (sensorField === 'temperatura') return rec.includes('enfriamiento') || rec.includes('extractor');
    if (['piso_analogico', 'agua_analogico', 'caudal'].includes(sensorField)) return rec.includes('entrada') || rec.includes('válvula') || rec.includes('agua cruda');
    if (sensorField === 'tds') return rec.includes('retrolavado') || rec.includes('filtro');
    return false;
  });
  
  return filtered.length > 0 ? filtered : ["Los parámetros de esta fase de filtración están operando normalmente."];
}
