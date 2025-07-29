import React, { useState, useEffect } from "react";
import "./Search.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { Button } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate, useLocation } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [where, setWhere] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [hasServiceAnimal, setHasServiceAnimal] = useState(false);

  useEffect(() => {
    if (location.state) {
      const {
        where: stateWhere,
        checkIn,
        checkOut,
        who,
        hasServiceAnimal: stateHasServiceAnimal,
      } = location.state;
      if (stateWhere) setWhere(stateWhere);
      if (checkIn) {
        const [day, month, year] = checkIn.split("/").map(Number);
        setStartDate(new Date(year, month - 1, day));
      }
      if (checkOut) {
        const [day, month, year] = checkOut.split("/").map(Number);
        setEndDate(new Date(year, month - 1, day));
      }
      if (who) setNumberOfGuests(parseInt(who));
      if (stateHasServiceAnimal !== undefined)
        setHasServiceAnimal(stateHasServiceAnimal);
    }
  }, [location.state]);

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  function handleSelect(ranges) {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  }

  const handleSearch = () => {
    if (endDate < startDate) {
      alert("Ngày trả phòng không thể trước ngày nhận phòng!");
      return;
    }
    if (numberOfGuests <= 0) {
      alert("Số lượng khách phải lớn hơn 0!");
      return;
    }
    const checkIn = `${startDate.getDate()}/${
      startDate.getMonth() + 1
    }/${startDate.getFullYear()}`;
    const checkOut = `${endDate.getDate()}/${
      endDate.getMonth() + 1
    }/${endDate.getFullYear()}`;
    navigate("/search", {
      state: {
        where,
        checkIn,
        checkOut,
        who: numberOfGuests.toString(),
        hasServiceAnimal,
      },
    });
  };

  return (
    <div className="search">
      <div className="search__location">
        <label>Where</label>
        <input
          type="text"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Search destinations"
        />
      </div>
      <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
      <h2>
        Number of guests <PeopleIcon />
      </h2>
      <input
        min={0}
        type="number"
        value={numberOfGuests}
        onChange={(e) =>
          setNumberOfGuests(Math.max(0, parseInt(e.target.value) || 0))
        }
      />
      <div className="search__serviceAnimal">
        <label>Service Animal</label>
        <input
          type="checkbox"
          checked={hasServiceAnimal}
          onChange={(e) => setHasServiceAnimal(e.target.checked)}
        />
      </div>
      <Button onClick={handleSearch} variant="contained" color="primary">
        Search Airbnb
      </Button>
    </div>
  );
}

export default Search;
