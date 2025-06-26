import "../stylesheets/cca-info.css"

export default function CCAItem(props) {
    return (
        <>
            <Link>
                <img className="cca-info-picture">{props.ccainfo.logo}</img>
                <h1 className="cca-info-cca-name">{props.ccainfo.name}</h1>
                <p className="cca-info-explanation">{props.ccainfo.description}</p>
            </Link>
        </>
    )
}