// Obtener localidades de una provincia (con caché)
export async function obtenerLocalidades(provinciaId: string) {
  try {
    const response = await fetch(
      `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinciaId}&campos=id,nombre&max=5000&orden=nombre`
    )
    
    if (!response.ok) {
      throw new Error('Error al obtener localidades')
    }
    
    const data = await response.json()
    
    return data.localidades.map((l: any) => ({
      id: l.id,
      nombre: l.nombre
    }))
  } catch (error) {
    console.error('Error obteniendo localidades:', error)
    return []
  }
}