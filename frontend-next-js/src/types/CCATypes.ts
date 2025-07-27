export interface CCASummary {
    description: string,
    id: number,
    logo: string,
    logo_url: string,
    name: string
}

export interface CCADetail {
    contact_email: string,
    description: string,
    facebook: string,
    id: number,
    instagram: string,
    logo: string,
    logo_url: string
    members: number[],
    name: string,
    website: string
}

export interface Member {
    cca: number,
    date_joined: string,
    first_name: string,
    id: number,
    is_active: boolean,
    last_name: string,
    notes: string,
    position: string,
    role: string,
    user: number
}

export interface Training {
    cca: number,
    date: string,
    end_time: string,
    id: number,
    location: string,
    max_participants: number,
    note: string,
    start_time: string
}