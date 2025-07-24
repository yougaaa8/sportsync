import React, { useState, useEffect } from "react";
import SearchIcon from "../assets/search-icon.png";
import FilterIcon from "../assets/sort-icon.png";
import "../stylesheets/cca-home.css";
import { Link } from "react-router-dom";
import CCAHomeItem from "../components/CCAHomeItem.jsx";
import pullCCAList from "../api-calls/pullCCAList.js";

export default function CCAHome() {
    const [ccas, setCcas] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCcas = async () => {
            try {
                console.log("Fetching CCA list...")
                const data = await pullCCAList()
                console.log("data is", data)
                setCcas(data || []) // Ensure it's always an array
            } catch (error) {
                console.error("Error fetching CCAs:", error)
                setCcas([]) // Set empty array on error
            }
        }
        fetchCcas()
    }, []);

    // Add safety checks in your filtering logic
    const filteredCcas = React.useMemo(() => {
        if (!Array.isArray(ccas) || !search.trim()) return ccas || [];
        // Case-insensitive search, bring matches to the top
        const lower = search.trim().toLowerCase();
        const matches = [];
        const nonMatches = [];
        for (const cca of ccas) {
            if (cca && cca.name && cca.name.toLowerCase().includes(lower)) {
                matches.push(cca);
            } else {
                nonMatches.push(cca);
            }
        }
        return [...matches, ...nonMatches];
    }, [ccas, search]);

    // Add safety check for mapping
    const ccaList = (filteredCcas || []).map(cca => (
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