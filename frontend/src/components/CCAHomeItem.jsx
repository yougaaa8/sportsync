import "../stylesheets/cca-info.css"
import { Link } from "react-router-dom"
import { Paper, Typography } from "@mui/material"

export default function CCAItem(props) {

    console.log(props)
    return (
        <>
            <Paper sx={{p: 2}}>
                <Link to={`/cca-detail/${props.ccainfo.id}`}>
                    <img className="cca-info-picture" src={props.ccainfo.logo} />
                    <Typography variant="h1" className="cca-info-cca-name">{props.ccainfo.name}</Typography>
                    <Typography sx={{color: "black"}} className="cca-info-explanation">{props.ccainfo.description} </Typography>
                </Link>
            </Paper>
        </>
    )
}