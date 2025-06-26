import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import SearchIcon from "../assets/search-icon.png"
import FilterIcon from "../assets/sort-icon.png"
import Archery from "../assets/Archery image.png"
import Baseball from "../assets/baseball image.webp"
import Cricket from "../assets/cricket image.webp"
import "../stylesheets/cca-home.css"
import { Link } from "react-router-dom"
import CCAItem from "../components/CCAItem.jsx"

import React, { useState, useEffect } from "react"

export default function CCAHome() {
    // Get the list of CCAs from the API
    // Map that list of CCAs to a list of <Links >

    // ccas is a state that contains an array of CCA objects
    const [ccas, setCcas] = React.useState([])

    useEffect(() => {
        fetch("/api/cca/list")
        .then(response => response.json())
        .then(data => setCcas(data))
        .catch(err => console.error("CCA List fetch error: ", err))
    }, [])

    // Each CCA will be turned into a Link component in React
    const ccaList = ccas.map(cca => {
        <CCAItem ccainfo={cca}/>
    })
    
    return (
        <>
            <Navbar />
            <main className="cca-home">
                <div className="cca-home-search-row">
                    <p className="cca-home-displaying-text">Displaying 8 out of 8 results</p>
                    <div className="cca-home-search-bar">
                        <form className="cca-home-search-bar-form">
                            <input placeholder="Enter a CCA here" />
                        </form>
                        <img className="cca-home-search-icon-image" src={ SearchIcon }></img>
                        <img className="cca-home-search-icon-image" src={ FilterIcon }></img>
                    </div>
                </div>
                <div className="cca-home-cca-row">
                    {ccaList}
                </div>
            </main>
            <Footer />
        </>
    )
}