export interface Match {
    date: string,
    description: string,
    end_time: string,
    id: number,
    location: string,
    max_capacity: number,
    name: string,
    open_lobby: boolean,
    sport: string,
    start_time: string
}

export interface MatchMember {
    date_joined: string,
    first_name: string,
    id: number,
    last_name: string, 
    lobby: number,
    notes: string,
    status: string
    user: number
}