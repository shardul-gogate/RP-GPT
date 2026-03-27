import { CardIconButtonEnum, IconButtonEnum } from "../utils/enums"
import { CardIconButton } from "./CardIconButton"
import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton"

export default function PlotPointsModal ({ closeModal, plotPoints, addPlotPoint, updatePlotPoint, deletePlotPoint }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [filter, setFilter] = useState('')

  const editPlotPoint = (index) => {
    setIsEditing(true)
    setEditingIndex(index)
  }

  const handleEdit = (plotPoint) => {
    updatePlotPoint(editingIndex, plotPoint)
    setIsEditing(false)
    setEditingIndex(null)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingIndex(null)
  }

  return (
    <div className="modal-overlay">
      <div className="large-modal">
        <div className="close-large-modal">
          <span>Plot Points</span>
          <IconButton icon={IconButtonEnum.CLOSE} onClick={closeModal}/>
        </div>
        <input
          type="text"
          placeholder="Filter"
          value={filter}
          disabled={isEditing}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="cards-grid">
          {
            plotPoints.map((plotPoint, index) => (
              (
                plotPoint.description.toLowerCase().includes(filter.toLowerCase())
                || plotPoint.triggers.join(", ").toLowerCase().includes(filter.toLowerCase())) && (
                isEditing && editingIndex === index ? (
                  <EditPlotPointCard
                    key={index}
                    plotPoint={plotPoint}
                    handleEdit={handleEdit}
                    cancelEdit={cancelEdit}
                  />
                ) : (
                  <PlotPointCard
                    key={index}
                    plotPoint={plotPoint}
                    addPlotPoint={() => addPlotPoint(index + 1)}
                    editPlotPoint={() => editPlotPoint(index)}
                    deletePlotPoint={() => deletePlotPoint(index)}
                  />
                )
              )
            ))
          }
        </div>
      </div>
    </div>
  );
}

function PlotPointCard ({ plotPoint, addPlotPoint, editPlotPoint, deletePlotPoint }) {
  const isSamplePlotPoint = plotPoint.sample || false
  return (
    <div className="plot-point-card">
      <div className="card-icon-button-row">
        <CardIconButton icon={CardIconButtonEnum.ADD} onClick={addPlotPoint}/>
        {!isSamplePlotPoint && <CardIconButton icon={CardIconButtonEnum.EDIT} onClick={editPlotPoint}/>}
        {!isSamplePlotPoint && <CardIconButton icon={CardIconButtonEnum.DELETE} onClick={deletePlotPoint}/>}
      </div>
      <span className="card-description">{plotPoint.description}</span>
      <div className="plot-point-triggers">
        {plotPoint.triggers.map(trigger => (
          <span className="plot-point-trigger" key={trigger}>{trigger}</span>
        ))}
      </div>
    </div>
  )
}

function EditPlotPointCard({ plotPoint, handleEdit, cancelEdit }) {
  const [description, setDescription] = useState(plotPoint.description)
  const [triggers, setTriggers] = useState(plotPoint.triggers)
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [description]);

  return (
    <div className="plot-point-card">
      <div className="card-icon-button-row">
        <CardIconButton icon={CardIconButtonEnum.CANCEL} onClick={cancelEdit}/>
        <CardIconButton icon={CardIconButtonEnum.DONE} onClick={() => {handleEdit({ description, triggers })}}/>
      </div>
      <textarea
        ref={textareaRef}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input
        type="text"
        value={triggers.join(", ")}
        onChange={(e) => {
          const newTriggers = e.target.value.split(",").map(trigger => trigger.trim());
          setTriggers(newTriggers);
        }}
      />
    </div>
  )
}
