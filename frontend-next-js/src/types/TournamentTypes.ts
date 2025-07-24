export interface TournamentSport {
    id: number,
    sport: string,
    gender: string,
    description: string,
    tournament: number
}

export interface Tournament {
    description: string,
    end_date: string,
    id: number,
    logo: string,
    name: string,
    start_date: string,
    status: string
}