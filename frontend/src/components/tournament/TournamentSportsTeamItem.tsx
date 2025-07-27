import { TournamentSportTeam } from "@/types/TournamentTypes";
import { Paper } from "@mui/material" 
import Image from "next/image";
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function TournamentSportsTeamItem(props: {
    team: TournamentSportTeam
}) {
    // Get current path
    const pathname = usePathname()
    
    return (
        <>
            <Link href={`${pathname}/${props.team.id}`}>
                <Paper>
                    {props.team.name}
                    <Image src={props.team.logo} alt={""} width={20} height={20}/>
                    {props.team.description}
                </Paper>
            </Link>
        </>
    );
}