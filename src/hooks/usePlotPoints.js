import { useState, useEffect } from "react";
import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function usePlotPoints() {
  const [plotPoints, setPlotPoints] = useState([]);

  useEffect(() => {
    api.get(ApiPaths.Api_PlotPoints)
      .then((data) => setPlotPoints(data))
      .catch(() => {});
  }, []);

  const addPlotPoint = (index) => {
    setPlotPoints(prev => {
      const newPlotPoints = [...prev];
      newPlotPoints.splice(index, 0, { description: "", triggers: [], sample: false });
      return newPlotPoints;
    });
  };

  const updatePlotPoint = (index, updatedPlotPoint) => {
    const currentPlotPoints = [...plotPoints];
    currentPlotPoints[index] = updatedPlotPoint;
    setPlotPoints(currentPlotPoints);
    api.post(ApiPaths.Api_PlotPoints, currentPlotPoints).catch(() => {});
  };

  const deletePlotPoint = (index) => {
    const currentPlotPoints = [...plotPoints];
    currentPlotPoints.splice(index, 1);
    setPlotPoints(currentPlotPoints);
    api.post(ApiPaths.Api_PlotPoints, currentPlotPoints).catch(() => {});
  };


  return { plotPoints, addPlotPoint, updatePlotPoint, deletePlotPoint };
}