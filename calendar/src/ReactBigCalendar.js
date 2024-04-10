import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Papa from "papaparse"; // CSV parsing library
import Data from './data.csv';

import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function ReactBigCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(Data); // Path to your CSV file
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csvData = decoder.decode(result.value);
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        }).data;

        const formattedEvents = parsedData.map((event) => {
          // Extract year, month, and day components from the date string
          const dateParts = event.date.split("-");
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // Adjusting month to be zero-based
          const day = parseInt(dateParts[2], 10);

          // Extract hour, minute, and second components from the startTime and endTime strings
          const startTimeParts = event.startTime.split(":");
          const startHour = parseInt(startTimeParts[0], 10);
          const startMinute = parseInt(startTimeParts[1], 10);

          const endTimeParts = event.endTime.split(":");
          const endHour = parseInt(endTimeParts[0], 10);
          const endMinute = parseInt(endTimeParts[1], 10);

          // Create Date objects for start and end times
          const startDate = new Date(
            year,
            month,
            day,
            startHour,
            startMinute,
            0
          );
          const endDate = new Date(
            year,
            month,
            day,
            endHour,
            endMinute,
            0
          );

          return {
            ...event,
            start: startDate,
            end: endDate,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);



  return (
    <div className="App">
      <Calendar
        views={["day", "agenda", "week"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="week"
        events={events}
        style={{ height: "100vh" }}
        onSelectEvent={(event) => alert(event.title)}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}
