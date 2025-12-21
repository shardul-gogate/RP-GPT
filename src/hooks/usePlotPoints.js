import { useState, useEffect } from "react";
import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function usePlotPoints() {
  const [plotPoints, setPlotPoints] = useState([]);

  useEffect(() => {
    api.get(ApiPaths.Api_PlotPoints)
      .then((data) => setPlotPoints(data));
  }, []);

  const addPlotPoint = () => {
    setPlotPoints(prev => [
      ...prev,
      { description: "", triggers: [] }
    ]);
  };

  const updatePlotPoint = (index, updatedPlotPoint) => {
    const currentPlotPoints = [...plotPoints];
    currentPlotPoints[index] = updatedPlotPoint;
    setPlotPoints(currentPlotPoints);

    api.post(ApiPaths.Api_PlotPoints, currentPlotPoints);
  };

  return { plotPoints, addPlotPoint, updatePlotPoint };
}