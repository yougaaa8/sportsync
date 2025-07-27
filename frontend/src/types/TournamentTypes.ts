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

export interface TournamentSportTeam {
    id: number,
    name: string,
    tournament_sport: number,
    logo: string,
    description: string
}

export interface TournamentSportTeamMember {
    id: number,
    team: number,
    user: number,
    jersey_name: string,
    jersey_number: number,
    role: string,
    photo: string,
}