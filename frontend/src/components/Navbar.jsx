import SoccerBall from "../assets/soccer-ball.png"

export default function Navbar() {
    return (
        <>
            <header>
                <nav>
                    <img className="sportsync-logo" 
                        src={ SoccerBall } />
                    <span className="logo-text">
                        SportSync</span>
                </nav>
            </header>
        </>
    )
}

