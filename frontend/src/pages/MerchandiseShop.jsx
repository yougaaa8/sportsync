import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { Paper, Typography } from "@mui/material"
import { Link } from "react-router-dom";

export default function MerchandiseShop() {
    return (
        <>
            <Navbar />
            <h1 className="page-title">SportSync Merchandise Shop</h1>
            <Paper sx={{p:3, m: 3}}>
                <Typography variant="h1">Limited Edition NUS Shirt</Typography>
                <Link to="https://forms.gle/fyJMK6Hi4tv91jns7">Order here</Link>
            </Paper>
            <Paper sx={{p:3, m: 3}}>
                <Typography variant="h1">Orbital Exclusive Shirt</Typography>
                <Link to="https://forms.gle/fyJMK6Hi4tv91jns7">Order here</Link>
            </Paper>
            <Paper sx={{p:3, m: 3}}>
                <Typography variant="h1">SportSync Shirt</Typography>
                <Link to="https://forms.gle/fyJMK6Hi4tv91jns7">Order here</Link>
            </Paper>
            <Footer />
        </>
    )
}