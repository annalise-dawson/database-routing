import { EventWithLocation } from '../../models/Event.js'
import knexFile from './knexfile.js'
import knex from 'knex'
import type { Location } from '../../models/Location.ts'

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
      'events.id as id',
      'events.day as day',
      'events.time as time',
      'events.name as eventName',
      'events.description as description',
      'locations.name as locationName',
    )

  return events
}
