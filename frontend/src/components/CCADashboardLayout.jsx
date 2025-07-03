import "../stylesheets/cca-dashboard-layout.css"
import CCAMembersTable from "./CCAMembersTable.jsx"
import CCATrainingTable from "./CCATrainingTable.jsx"
import CCAMemberManagement from "../pages/CCAMemberManagementLayout.jsx"
import { TableRow, TableCell, Typography } from "@mui/material"

export default function CCADashboardLayout(props) {
    console.log("Rendering CCA Dashboard Layout")
    console.log(props.trainingData)

    // The members data passed into props is an array of member objects
    // Map each object in the members data array into a table row
    const membersList = props.membersData.map(member => (
        <TableRow key={member.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell align="center">{member.id}</TableCell>
            <TableCell align="center">{member.first_name}</TableCell>
            <TableCell align="center">{member.last_name}</TableCell>
            <TableCell align="center">{member.position}</TableCell>
            <TableCell align="center">{member.role}</TableCell>
            <TableCell>
                <button>Remove member</button>
            </TableCell>
        </TableRow>
    ))

    // The training data passed into props is an array of training objects
    // Map each object in the training data array into a table row
    const trainingList = props.trainingData.map(training => (
        <TableRow key={training.id}>
            <TableCell align="center">{training.id}</TableCell>
            <TableCell align="center">{training.date}</TableCell>
            <TableCell align="center">{training.start_time}</TableCell>
            <TableCell align="center">{training.end_time}</TableCell>
            <TableCell align="center">{training.location}</TableCell>
            <TableCell align="center">{training.note}</TableCell>
        </TableRow>
    ))

    // Function that runs when member management button is clicked
    function membersTableClick() {
        return <CCAMemberManagement membersList={membersList}/>
    }

    // Function that runs when training session management button is clicked

    return (
        <div className="cca-dashboard-layout">
            <div>
                <Typography variant="h1">Member Management</Typography>
                <button onClick={membersTableClick}>
                    <a href={`/cca-member-management/${props.ccaId}`}>Manage members</a>
                </button>
            </div>
            <br />
            <CCAMembersTable membersList={membersList}/>
            <br />
            <br />

            <hr />
            <br />

            <div>
                <Typography variant="h1">Training Session Management</Typography>
                <button>
                    <a href={`/cca-training-management/${props.ccaId}`}>Manage training sessions</a>
                </button>
            </div>
            <br />

            <CCATrainingTable trainingList={trainingList}/>
        </div>
    )
}