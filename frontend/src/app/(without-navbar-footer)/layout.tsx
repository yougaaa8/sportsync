import ClientLayout from "../../components/ClientLayout"

export default function WithoutNavbarAndFooterLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <ClientLayout withNavbarAndFooter={false}>
            {children}
        </ClientLayout>
    )
}