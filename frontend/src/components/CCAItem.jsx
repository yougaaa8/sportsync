import "../stylesheets/cca-info.css"
import { Link } from "react-router-dom"

export default function CCAItem(props) {

    console.log(props)
    return (
        <>
            <Link to={`/cca-detail/${props.ccainfo.id}`}>
                <img className="cca-info-picture" src={props.ccainfo.logo} />
                <h1 className="cca-info-cca-name">{props.ccainfo.name}</h1>
                <p className="cca-info-explanation">{props.ccainfo.description}</p>
            </Link>
        </>
    )
}