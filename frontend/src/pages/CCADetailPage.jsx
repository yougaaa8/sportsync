import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import CCALayout from "../components/CCALayout.jsx"

export default function CCADetailPage() {
    const { ccaId } = useParams()
    const [ccaData, setCcaData] = useState(null)
    const [error, setError] = useState(null)
    const token = localStorage.getItem("authToken")

    console.log("This is the extracted CCA ID: ", ccaId)

    useEffect(() => {
        console.log("helo")
        const fetchCcaData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cca/${ccaId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json"
                    }
                })

                if (!response.ok) {
                    throw new Error("CCA not found")
                }
                
                const data = await response.json()
                setCcaData(data)
                console.log("CCA data retrieved")
            }
            catch (err) {
                setError(err.message)
            }
        }

        if (ccaId) {
            fetchCcaData()
        }
    }, [ccaId])

    console.log("The CCA Data is: ", ccaData)

    return (
        <>
            <Navbar />
            {!ccaData ? <h1>Loading...</h1> : <CCALayout entry={ccaData}/>}
            <Footer />
        </>
    )
}