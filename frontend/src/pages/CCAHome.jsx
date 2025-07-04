import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import SearchIcon from "../assets/search-icon.png";
import FilterIcon from "../assets/sort-icon.png";
import "../stylesheets/cca-home.css";
import { Link } from "react-router-dom";
import CCAHomeItem from "../components/CCAHomeItem.jsx";

export default function CCAHome() {
    const [ccas, setCcas] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        fetch("https://sportsync-backend-8gbr.onrender.com/api/cca/list/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error(`Response: ${response.status} ${response.statusText}`);
            return response.json();
        })
        .then(data => setCcas(data))
        .catch(err => console.error("CCA List fetch error: ", err));
    }, []);

    // Filter and sort CCAs based on search
    const filteredCcas = React.useMemo(() => {
        if (!search.trim()) return ccas;
        // Case-insensitive search, bring matches to the top
        const lower = search.trim().toLowerCase();
        const matches = [];
        const nonMatches = [];
        for (const cca of ccas) {
            if (cca.name.toLowerCase().includes(lower)) {
                matches.push(cca);
            } else {
                nonMatches.push(cca);
            }
        }
        return [...matches, ...nonMatches];
    }, [ccas, search]);

    const ccaList = filteredCcas.map(cca => (
        <CCAHomeItem key={cca.id} ccainfo={cca} />
    ));

    return (
        <>
            <Navbar />
            <main className="cca-home">
                <h1 className="page-title">NUS CCAs</h1>
                <div className="cca-home-search-row">
                    <p className="cca-home-displaying-text">
                        Displaying {filteredCcas.length} out of {ccas.length} results
                    </p>
                    <div className="cca-home-search-bar">
                        <form
                            className="cca-home-search-bar-form"
                            onSubmit={e => e.preventDefault()}
                        >
                            <input
                                placeholder="Enter a CCA here"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </form>
                        <img className="cca-home-search-icon-image" src={SearchIcon} alt="search" />
                        <img className="cca-home-search-icon-image" src={FilterIcon} alt="filter" />
                    </div>
                </div>
                <div className="cca-home-cca-row">
                    {ccaList}
                </div>
            </main>
            <Footer />
        </>
    );
}