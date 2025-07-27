"use client"

import { useState, useEffect } from "react";
import TournamentSportsItem from "../../../../components/tournament/TournamentSportsItem"
import { pullTournamentData } from "../../../../api-calls/tournament/pullTournamentData.js"
import { pullTournamentSportsData } from "../../../../api-calls/tournament/pullTournamentSportsData.js";
import { TournamentSport, Tournament } from "../../../../types/TournamentTypes"
import { Button, Box, TextField, Typography, MenuItem } from "@mui/material"
import createTournamentSport from "../../../../api-calls/tournament/createTournamentSport"

export default function TournamentSportsPage({params}: {
    params: Promise<{
        tournamentId: string
    }>
}) {

    // Set states
    const [tournamentSports, setTournamentSports] = useState<TournamentSport[] | null>(null);
    const [tournamentData, setTournamentData] = useState<Tournament[] | null>(null);
    const [tournamentIdState, setTournamentIdState] = useState<number | null>(null)
    const [isShowForm, setIsShowForm] = useState(false)

    // Resolve the params
    useEffect(() => {
        const resolveParams = async () => {
            const { tournamentId } = await params
            console.log("This is the tournament id: ", tournamentId)
            setTournamentIdState(parseInt(tournamentId))
        }
        resolveParams()
    }, [params])

    const token = localStorage.getItem("authToken");

    // Fetch the tournament sports list
    useEffect(() => {
        const fetchTournamentSports = async () => {
            setTournamentSports(await pullTournamentSportsData(tournamentIdState))
        };
        if (token && tournamentIdState) {
            fetchTournamentSports();
        }
    }, [tournamentIdState, token]);  

    // Fetch tournament data for the tournament name
    useEffect(() => {
        async function fetchData() {
            const data = await pullTournamentData();
            setTournamentData(data);
        }
        fetchData();
    }, []);

    // Map the tournament sports list to JSX elements
    const tournamentSportsElements = tournamentSports ? tournamentSports.map((sport, idx) => (
        <TournamentSportsItem
            key={sport.id || idx}
            id={sport.id}
            sport={sport.sport}
            gender={sport.gender}
            description={sport.description}
            tournament={sport.tournament}
        />
    )) : null;

    // Resolve the name of the tournament from the extracted tournament data
    const name = tournamentData?.find(tournament => tournament.id === tournamentIdState)?.name

    // Define functions
    function createTournamentSportClick(formData: FormData) {
        createTournamentSport(tournamentIdState, formData)
    }

    return (
        <>
            <Button onClick={() => setIsShowForm(prev => !prev)}>
                {isShowForm ? "Close Form" : "Add Tournament Sport"}
            </Button>
            {isShowForm && (
  <Box
    component="form"
    action={createTournamentSportClick}
    sx={{
      p: 4,
      mb: 4,
      borderRadius: 2,
      boxShadow: 2,
      backgroundColor: "#fff",
      maxWidth: 400,
      mx: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, color: "primary.main", fontWeight: 700 }}>
      Add Tournament Sport
    </Typography>

    <TextField
      label="Sport"
      name="sport"
      variant="outlined"
      fullWidth
      required
    />

    <TextField
      select
      label="Gender"
      name="gender"
      variant="outlined"
      fullWidth
      defaultValue="male"
      required
    >
      <MenuItem value="male">Male</MenuItem>
      <MenuItem value="female">Female</MenuItem>
      <MenuItem value="co-ed">Co-Ed</MenuItem>
    </TextField>

    <TextField
      label="Description"
      name="description"
      variant="outlined"
      fullWidth
      multiline
      rows={2}
    />

    <Button
      type="submit"
      variant="contained"
      color="primary"
      sx={{ mt: 2, fontWeight: 600 }}
    >
      Submit
    </Button>
  </Box>
)}

    <Button onClick={setIsShowManageTournamentForm(prev => !prev)}>
        Manage Tournament Details
    </Button>
    <form action={manageTournamentClick}>
        <label></label>
        <input></input>
    </form>

            { tournamentData && tournamentIdState && <h1 className="page-title">{name}</h1>}
            { tournamentSports ? tournamentSportsElements : <h1 className="page-title">Loading...</h1>}
        </>
    )
}