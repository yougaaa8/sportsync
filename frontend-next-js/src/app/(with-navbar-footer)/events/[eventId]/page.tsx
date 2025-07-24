"use client"

import { useState, useEffect } from "react";
import pullEventDetails from "../../../../api-calls/events/pullEventDetails"
import { Event } from "../../../../types/EventTypes"
import EventRegistrationButton from "../../../../components/events/EventRegistrationButton.jsx"
import EventLeaveButton from "../../../../components/events/EventLeaveButton.jsx"

export default function EventDetailPage({params}: {
    params: Promise<{
        eventId: string
    }>
}) {
    // Set state(s)
    const [eventDetails, setEventDetails] = useState<Event | null>(null);

    // Helper function to format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Resolve params and extract event details
    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            const eventId = parseInt(resolvedParams.eventId)
            setEventDetails(await pullEventDetails(eventId))
        }
        resolveParams()
    }, [params])

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Section - More Professional */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-12">
                        <div className="text-center">
                            <h1 className="text-3xl font-semibold mb-3">
                                {eventDetails?.name}
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-orange-100">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-base font-medium">
                                    {eventDetails?.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-8">
                        {/* Event Description */}
                        {eventDetails?.description && (
                            <div className="text-center mb-10">
                                <p className="text-lg text-gray-600">
                                    {eventDetails.description}
                                </p>
                            </div>
                        )}

                        {/* Event Details - Clean Professional Layout */}
                        <div className="space-y-8 mb-10">
                            {/* Date and Registration Row */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Event Date */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Event Date
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {eventDetails? formatDate(eventDetails?.date) : null}
                                        </p>
                                    </div>
                                </div>

                                {/* Registration Deadline */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Registration Deadline
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {eventDetails? formatDate(eventDetails?.registration_deadline) : null}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Participants and Fee Row */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Participants */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Participants
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-gray-700 font-medium">
                                                {eventDetails?.participants_count} registered
                                            </p>
                                            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                {eventDetails?.participants_count}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Fee */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Registration Fee
                                            </h3>
                                        </div>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            ${eventDetails ? parseFloat(eventDetails.registration_fee).toFixed(2) : null}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Organization Info Row */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Organizer */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Organizer
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {eventDetails?.organizer}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Contact
                                            </h3>
                                        </div>
                                        <a 
                                            href={`mailto:${eventDetails?.contact_point}`}
                                            className="text-orange-600 font-medium hover:text-orange-700 hover:underline transition-colors"
                                        >
                                            {eventDetails?.contact_point}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-gray-200">
                            <EventRegistrationButton 
                                event={eventDetails}
                                className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                            >
                                Register for Event
                            </EventRegistrationButton>
                            <EventLeaveButton 
                                event={eventDetails}
                                className="w-full sm:w-auto border border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Leave Event
                            </EventLeaveButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}