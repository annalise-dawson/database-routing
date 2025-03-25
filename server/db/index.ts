// import { EventWithLocation } from '../../models/Event.js'
import knexFile from './knexfile.js'
import knex from 'knex'
import type { /*Location,*/ LocationData } from '../../models/Location.ts'
import { EventData } from '../../models/Event.ts'

type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
export const connection = knex(config)

export async function getAllLocations() {
  const locations = await connection('locations').select()
  return locations
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

  return events
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

export async function addNewEvent(newEvent: EventData) {
  const results = await connection('events').insert({
    day: newEvent.day,
    description: newEvent.description,
    time: newEvent.time,
    name: newEvent.name,
    location_id: Number(newEvent.locationId),
  })

  return results
}

export async function deleteEvent(id: number) {
  const result = await connection('events').where('id', id).delete()
  return result
}

export async function getEventById(id: number) {
  const event = await connection('events')
    .where('id', id)
    .select(
      'id',
      'location_id as locationId',
      'day',
      'time',
      'name',
      'description',
    )
    .first()

  return event
}

// export async function editEvent(editedEvent: EventData, id: number) {
//   const result = await connection('events').where({ id }).update(editedEvent)
//   return result
// }
