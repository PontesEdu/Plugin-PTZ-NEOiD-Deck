const speedLimits = {
  pan: 24,
  zoom: 7,
  focus: 7
};

type SpeedTypes = keyof typeof speedLimits;

function calcularSpeeds(
  level: number,
  limites: typeof speedLimits
): Record<SpeedTypes, number> {
  const porcentagem = (level / 10) * 100;
  const resultado = {} as Record<SpeedTypes, number>;

  for (const tipo in limites) {
    const key = tipo as SpeedTypes;
    resultado[key] = Math.round((porcentagem / 100) * limites[key]);
  }

  return resultado;
}

