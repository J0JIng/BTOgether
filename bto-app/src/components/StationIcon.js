import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";

const OneCodeButton = ({ stationCode }) => {
  const [bg, setBg] = useState("white");
  const [text, setText] = useState("white");

  useEffect(() => {
    if (stationCode.includes("NS")) {
      setBg("#d42e12");
      setText("white");
    } else if (stationCode.includes("EW") || stationCode.includes("CG")) {
      setBg("#009645");
      setText("white");
    } else if (stationCode.includes("NE")) {
      setBg("#9900aa");
      setText("white");
    } else if (stationCode.includes("CC") || stationCode.includes("CE")) {
      setBg("#fa9e0d");
      setText("black");
    } else if (stationCode.includes("DT")) {
      setBg("#005ec4");
      setText("white");
    } else if (stationCode.includes("TE")) {
      setBg("#9D5B25");
      setText("white");
    } else if (
      stationCode.includes("BP") ||
      stationCode.includes("SE") ||
      stationCode.includes("SW") ||
      stationCode.includes("PE") ||
      stationCode.includes("PW") ||
      stationCode.includes("STC") ||
      stationCode.includes("PTC")
    ) {
      setBg("#748477");
      setText("white");
    } else if (stationCode.includes("CR") || stationCode.includes("CP")) {
      setBg("#97C616");
      setText("black");
    } else if (
      stationCode.includes("JS") ||
      stationCode.includes("JW") ||
      stationCode.includes("JE") ||
      stationCode.includes("JW")
    ) {
      setBg("#0099aa");
      setText("white");
    } else if (stationCode.includes("RTS")) {
      setBg("#87CEFA");
      setText("black");
    }
  }, [stationCode]);

  return (
    <Button
      variant="contained"
      size="small"
      sx={{
        pointerEvents: "none",
        fontWeight: "bold",
        bgcolor: bg,
        color: text,
        "&:hover": { bgcolor: "inherit" },
      }}
    >
      {stationCode}
    </Button>
  );
};

const ManyCodeButton = ({ stationCode }) => {
  const [colors, setColors] = useState([]);
  const [textColors, setTextColors] = useState([]);

  useEffect(() => {
    const stationSegments = stationCode.split("/");
    const segmentColors = stationSegments.map((segment) => {
      if (segment.includes("NS")) {
        return "#d42e12";
      } else if (segment.includes("EW") || segment.includes("CG")) {
        return "#009645";
      } else if (segment.includes("NE")) {
        return "#9900aa";
      } else if (segment.includes("CC") || segment.includes("CE")) {
        return "#fa9e0d";
      } else if (segment.includes("DT")) {
        return "#005ec4";
      } else if (segment.includes("TE")) {
        return "#9D5B25";
      } else if (
        segment.includes("BP") ||
        segment.includes("SE") ||
        segment.includes("SW") ||
        segment.includes("PE") ||
        segment.includes("PW") ||
        segment.includes("STC") ||
        segment.includes("PTC")
      ) {
        return "#748477";
      } else if (segment.includes("CR") || segment.includes("CP")) {
        return "#97C616";
      } else if (
        segment.includes("JS") ||
        segment.includes("JW") ||
        segment.includes("JE") ||
        segment.includes("JW")
      ) {
        return "#0099aa";
      } else if (segment.includes("RTS")) {
        return "#87CEFA";
      }
    });
    const segmentTextColors = stationSegments.map((segment) => {
      if (
        segment.includes("CC") ||
        segment.includes("CE") ||
        segment.includes("CR") ||
        segment.includes("CP")
      ) {
        return "black";
      } else if (segment.includes("RTS")) {
        return "black";
      } else {
        return "white";
      }
    });
    setColors(segmentColors);
    setTextColors(segmentTextColors);
  }, [stationCode]);

  const segments = stationCode.split("/");

  return (
    <ButtonGroup
      variant="contained"
      aria-label="Basic button group"
      sx={{
        "& .MuiButtonGroup-grouped": {
          borderWidth: 0, // Set border width to 0 to remove the divider
        },
      }}
    >
      {segments.map((segment, index) => (
        <Button
          size="small"
          key={index}
          sx={{
            pointerEvents: "none",
            fontWeight: "bold",
            bgcolor: colors[index] || "white",
            color: textColors[index] || "white",
            "&:hover": { bgcolor: "inherit" },
          }}
        >
          {segment}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const StationIcon = ({ stationCode }) => {
  // Check if stationCode contains a '/'
  if (stationCode.includes("/")) {
    return <ManyCodeButton stationCode={stationCode} />;
  } else {
    return <OneCodeButton stationCode={stationCode} />;
  }
};

export default StationIcon;
