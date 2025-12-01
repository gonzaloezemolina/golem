export interface ShippingResult {
  costo: number
  zona: string
  mensaje: string
  esGratis: boolean
}

export function calcularEnvio(
  provinciaNombre: string, 
  ciudadNombre: string
): ShippingResult {
  
  // Normalizar texto (quitar acentos, lowercase, trim)
  const normalizar = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  }

  const provincia = normalizar(provinciaNombre)
  const ciudad = normalizar(ciudadNombre)

  // ========================================
  // ROSARIO - ENVÍO GRATIS
  // ========================================
  const rosario = 'rosario'
  if (provincia === 'santa fe' && ciudad === 'rosario') {
    return {
      costo: 0,
      zona: 'Estimado de 1-2 días hábiles',
      mensaje: 'Envíos en Rosario',
      esGratis: true
    }
  } else if (provincia === 'santa fe' && ciudad !== rosario) {
      return {
      costo: 7500,
      zona: 'Estimado de 3-4 días hábiles',
      mensaje: `Envio a ${provinciaNombre}, ${ciudadNombre}`,
      esGratis: false
    }
  }

  // ========================================
  // PATAGONIA - $8.500
  // ========================================
  const patagonia = [
    'chubut',
    'rio negro',
    'neuquen',
    'santa cruz',
    'tierra del fuego'
  ]

  if (patagonia.includes(provincia)) {
    return {
      costo: 12000,
      zona: 'Estimado de 7-9 días hábiles',
      mensaje: `Envio a ${provinciaNombre}, ${ciudadNombre}`,
      esGratis: false
    }
  }

  // ========================================
  // RESTO DEL PAÍS - $6.500
  // ========================================
  return {
    costo: 10000,
    zona: 'Estimado de 4-5 días hábiles',
    mensaje: `Envio a ${provinciaNombre}, ${ciudadNombre}`,
    esGratis: false
  }
}