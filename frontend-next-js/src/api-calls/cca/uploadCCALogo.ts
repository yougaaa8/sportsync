import { API_BASE_URL } from "../../config/api";

export default async function uploadCCALogo(file: File, ccaId: string) {
    const token = localStorage.getItem("authToken")
    try {
        const formData = new FormData()
        formData.append("logo", file)

        const response = await fetch(`${API_BASE_URL}/api/cca/${ccaId}/upload-logo`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        if (!response.ok) {
            console.log("Failed to upload CCA Logo: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully uploaded CCA Logo: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to upload CCA Logo: ", err)
    }
}
