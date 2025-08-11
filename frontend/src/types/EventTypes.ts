export interface Event {
  cca: number,
  contact_point: string,
  date: string,
  description: string,
  id: number,
  is_public: boolean,
  location: string,
  name: string,
  organizer: string,
  participants_count: number,
  poster: string,
  poster_url: string,
  registration_deadline: string,
  registration_fee: string
}

export interface EventParticipant {
  event: number,
  id: number,
  registered_at: string,
  status: string,
  user: number
}
