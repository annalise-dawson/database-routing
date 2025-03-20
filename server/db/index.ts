import { EventWithLocation } from '../../models/Event.js'
import knexFile from './knexfile.js'
import knex, { Knex } from 'knex'
import type { Location, LocationData } from '../../models/Location.ts'

type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
export const connection = knex(config)

export async function getAllLocations() {
  const locations = await connection('locations').select()
  return locations as Location[]
}

export async function getEventsByDay(day: string) {
  const events = await connection('events')
    .join('locations', 'events.location_id', '=', 'locations.id')
    .where('events.day', day)
    .select(
      'events.id',
      'events.day',
      'events.time',
      'events.name as eventName',
      'events.description',
      'locations.name as locationName',
    )

  return events as EventWithLocation[]
}

export async function getLocationById(id: string) {
  const location = await connection('locations')
    .where('id', id)
    .select('id', 'name', 'description')
    .first()

  return location
}

export async function updateLocation(
  id: number,
  updatedLocation: LocationData,
) {
  const location = await connection('locations')
    .where('id', id)
    .update(updatedLocation)

  return location
}
