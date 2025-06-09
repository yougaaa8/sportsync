import ArcheryImage from "../assets/Archery image.png"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/cca-info.css"

export default function Archery() {
    return (
        <>
            <Navbar />
            <main className="cca-info-main">
                <img className="cca-info-picture" src={ ArcheryImage }></img>
                <div className="cca-explanation">
                    <h1 className="cca-info-cca-name">Archery</h1>
                    <h2 className="cca-info-cca-paragraph-header">Overview</h2>
                    <p className="cca-info-cca-paragraph">Welcome to NUS Archery, a vibrant community that extends an open invitation to all students, irrespective of their archery experience or skill level. Our mission revolves around fostering the love for archery within the NUS community, whether as a recreational pursuit or a journey towards sports excellence. Anchored by a commitment to provide you with the finest student life encounters both on and off the field, we are excited to invite you to embark on this archery adventure with us.</p>
                    <h2 className="cca-info-cca-paragraph-header">Training Schedule</h2>
                    <p className="cca-info-cca-paragraph"> The training schedule, common for both recreational and varsity teams, comprises sessions on Tuesdays and Thursdays from 6:30 to 9 pm, as well as Saturdays from 10 am to 12:30 pm at our designated archery range. </p>
                    <h2 className="cca-info-cca-paragraph-header">Registration</h2>
                    <p className="cca-info-cca-paragraph">To delve deeper into the myriad of activities and experiences we offer, we invite you to explore our Instagram and Facebook pages. Feel free to reach out to any of our Exco members for further inquiries or simply to connect. As we stride forward with the goal of achieving sports excellence, we eagerly anticipate the collective growth, achievements, and memories that await each and every member of NUS Archery.</p>
                    <h2 className="cca-info-cca-paragraph-header">Competition Details</h2>
                    <p className="cca-info-cca-paragraph">Our competitive teams stand as a testament to our dedication. Each academic year, we engage in two prominent competitions: the NUS Indoors Archery Championships during Semester 1 and the NTU Indoors Archery Championships (NTU IAC) in Semester 2. However, it's essential to note that our dedication to sports excellence does not segregate our members. Recreational and varsity teams unite during training sessions, fostering a sense of camaraderie that transcends levels of experience. We firmly believe in providing equal opportunities for everyone to excel. As we strive for sports excellence, we ensure that both recreational and competitive members have the chance to participate in the aforementioned competitions.</p>
                </div>
            </main>
            <Footer />
        </>
    )
}