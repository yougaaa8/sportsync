import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import CCADetailLayout from "../components/CCADetailLayout.jsx"
import pullCCADetail from "../api-calls/pullCCADetail.js"

export default function CCADetailPage() {
    const { ccaId } = useParams()
    const [ccaData, setCcaData] = useState(null)
    const [error, setError] = useState(null)
    const token = localStorage.getItem("authToken")

    console.log("This is the extracted CCA ID: ", ccaId)

    useEffect(() => {
        const fetchCcaData = async () => {
            setCcaData(await pullCCADetail(ccaId))
        }
        if (ccaId) {fetchCcaData()}
    }, [ccaId])

    console.log("The CCA Data is: ", ccaData)

    return (
        <>
            <Navbar />
            {!ccaData ? <h1>Loading...</h1> : <CCADetailLayout entry={ccaData}/>}
            <Footer />
        </>
    )
}