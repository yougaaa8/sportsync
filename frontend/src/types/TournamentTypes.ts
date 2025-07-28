export interface TournamentSport {
    id: number,
    sport: string,
    gender: string,
    description: string,
    tournament: Tournament
}

export interface Tournament {
    description: string,
    end_date: string,
    id: number,
    logo: string,
    logo_url: string,
    name: string,
    start_date: string,
    status: string
}

export interface TournamentSportTeam {
    id: number,
    name: string,
    tournament_sport: TournamentSport,
    logo: string,
    logo_url: string,
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

export interface TournamentSportMatch {
    id: number
    tournament_sport: number
    team1: TournamentSportTeam
    team2: TournamentSportTeam
    round: number
    date: string, 
    venue: string
    score_team1: number
    score_team2: number
    winner: number | null
    match_notes: string
}