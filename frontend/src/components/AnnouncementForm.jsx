export default function AnnouncementForm(props) {
    function handleAnnouncementClick(formData) {
        props.api(formData, props.id)
    }

    return (
        <form onSubmit={handleAnnouncementClick}>
            <label>Title</label>
            <input name="title"></input>

            <label>Message</label>
            <input name="message"></input>

            <button type="submit">Send Announcement</button>
        </form>
    )
}