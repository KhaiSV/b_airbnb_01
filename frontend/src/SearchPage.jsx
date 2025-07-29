import React, { useEffect, useState } from "react";
import "./SearchPage.css";
import { Button } from "@mui/material";
import SearchResult from "./SearchResult";
import { useLocation } from "react-router-dom";

function SearchPage() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const { where, checkIn, checkOut, who, hasServiceAnimal } =
    location.state || {};

  useEffect(() => {
    const mockData = [
      {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
        location: "Private room in center of London",
        title: "Cozy London Flat for Couples",
        description:
          "2 guests · 1 bedroom · 1 bed · 1 bathroom · Wifi · Kitchen",
        star: 4.6,
        price: "£50 / night",
        total: "£400 total",
        guests: 2,
        availableFrom: "2025-07-01T00:00:00Z",
        availableTo: "2025-08-01T00:00:00Z",
        allowsServiceAnimal: true,
      },
      {
        img: "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
        location: "Hotel London in West End",
        title: "Luxury Suite in West London",
        description: "2 guests · 1 bedroom · 1 king bed · 1 bathroom · Wifi",
        star: 4.4,
        price: "£70 / night",
        total: "£560 total",
        guests: 2,
        availableFrom: "2025-07-10T00:00:00Z",
        availableTo: "2025-07-25T00:00:00Z",
        allowsServiceAnimal: false,
      },
      {
        img: "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
        location: "Apartment in North London",
        title: "Spacious North London Apartment",
        description:
          "2 guests · 2 bedrooms · 2 beds · 1 bathroom · Free parking",
        star: 4.2,
        price: "£45 / night",
        total: "£360 total",
        guests: 2,
        availableFrom: "2025-07-01T00:00:00Z",
        availableTo: "2025-07-20T00:00:00Z",
        allowsServiceAnimal: true,
      },
      {
        img: "https://cdn.bisnow.net/fit?height=489&type=jpeg&url=https%3A%2F%2Fs3.amazonaws.com%2Fcdn.bisnow.net%2Fcontent%2Fimages%2F2017%2F05%2F59151d0978bbf_https_press_atairbnb_com_app_uploads_2016_12_midtown_4.jpeg&width=717&sign=FeltIPi9cOWA36nVIeDvZxwgtiCZrpUyMRdvyZviTUI",
        location: "Home in California",
        title: "California Beach House",
        description: "2 guests · 1 bedroom · 1 bed · 1 bathroom · Wifi",
        star: 4.5,
        price: "£60 / night",
        total: "£480 total",
        guests: 2,
        availableFrom: "2025-07-01T00:00:00Z",
        availableTo: "2025-08-01T00:00:00Z",
        allowsServiceAnimal: false,
      },
      {
        img: "https://media.cntraveler.com/photos/5a8f258bd363c34048b35aac/master/w_2250,h_1500,c_limit/airbnb-plus-london.jpg",
        location: "London Riverside Retreat",
        title: "Riverside London Getaway",
        description: "2 guests · 1 bedroom · 1 bed · 1 bathroom · Free parking",
        star: 4.7,
        price: "£55 / night",
        total: "£440 total",
        guests: 2,
        availableFrom: "2025-07-05T00:00:00Z",
        availableTo: "2025-07-19T00:00:00Z",
        allowsServiceAnimal: true,
      },
    ];

    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const [day, month, year] = dateStr
        .split("/")
        .map((num) => num.padStart(2, "0"));
      const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
      console.log(`Parsing ${dateStr} -> ${date.toISOString()}`); // Debug
      return isNaN(date.getTime()) ? null : date;
    };

    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);
    const totalGuests = who ? parseInt(who) : null;

    console.log("Search Params:", {
      where,
      checkIn,
      checkOut,
      who,
      hasServiceAnimal,
      checkInDate,
      checkOutDate,
    }); // Debug

    const filteredResults = mockData.filter((result) => {
      const matchesLocation =
        !where || result.location.toLowerCase().includes(where.toLowerCase());
      const matchesGuests = !totalGuests || totalGuests <= result.guests;
      const resultAvailableFrom = new Date(result.availableFrom);
      const resultAvailableTo = new Date(result.availableTo);
      const matchesDates =
        !checkInDate ||
        !checkOutDate ||
        (checkInDate <= resultAvailableTo &&
          checkOutDate >= resultAvailableFrom);
      const matchesServiceAnimal =
        !hasServiceAnimal || result.allowsServiceAnimal;
      console.log("Result Check:", result.title, {
        matchesLocation,
        matchesGuests,
        matchesDates,
        matchesServiceAnimal,
        checkInDate,
        checkOutDate,
        resultAvailableFrom,
        resultAvailableTo,
      }); // Debug
      return (
        matchesLocation && matchesGuests && matchesDates && matchesServiceAnimal
      );
    });

    console.log("Filtered Results:", filteredResults); // Debug
    setSearchResults(filteredResults);
  }, [where, checkIn, checkOut, who, hasServiceAnimal]);

  return (
    <div className="searchPage">
      <div className="searchPage__info">
        <p>
          {searchResults.length} stays · {checkIn || "Any date"} to{" "}
          {checkOut || "Any date"} · {who || "Any"} guest
          {who && parseInt(who) > 1 ? "s" : ""} ·{" "}
          {hasServiceAnimal ? "Service animal allowed" : ""}
        </p>
        <h1>Stays in {where || "any location"}</h1>
        <Button variant="outlined">Cancellation Flexibility</Button>
        <Button variant="outlined">Type of place</Button>
        <Button variant="outlined">Price</Button>
        <Button variant="outlined">Rooms and beds</Button>
        <Button variant="outlined">More filters</Button>
      </div>
      {searchResults.length > 0 ? (
        searchResults.map((result, index) => (
          <SearchResult
            key={index}
            img={result.img}
            location={result.location}
            title={result.title}
            description={result.description}
            star={result.star}
            price={result.price}
            total={result.total}
          />
        ))
      ) : (
        <p>No results found for your search.</p>
      )}
    </div>
  );
}

export default SearchPage;
