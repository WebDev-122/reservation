import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import * as actions from '../../store/actions';

const AddReservationModal = ({open, onCloseModal}) => {
  const [deviceName, setDeviceName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isEnableCreate, setEnableCreate] = useState(false);

  const resources = useSelector(state => state.resource);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    onCloseModal(false);
  }, []);

  const deviceNames = useMemo(() => {
    let result = [];
    resources.forEach(resource => {
      result.push(resource.title);
    });
    return result;
  }, [resources]);

  const handleCreate = useCallback(() => {
    dispatch(actions.addEvent({
      useId: 1,
      resourceId: deviceNames.indexOf(deviceName) + 1,
      start: startTime,
      end: endTime
    }));
    handleClose();
  }, [deviceName, startTime, endTime]);

  const addMinuteValue = useMemo(() => {
    return new Date(startTime.getTime() + 30 * 60000)
  }, [startTime]);

  useEffect(() => {
    deviceName ? setEnableCreate(true) : setEnableCreate(false)
  }, [deviceName]);
  
  if(!open)
    return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-body">
          <div className="p-fluid">
            <div className="modal-item">
              <label htmlFor="device">Device</label>
              <Dropdown
                id="device"
                options={deviceNames}
                value={deviceName}
                onChange={e => setDeviceName(e.value)}
                placeholder="Select a Device"
              />
            </div>
            <div className="modal-item">
              <label htmlFor="start_time">Start Time</label>
              <Calendar
                id="start_time"
                value={startTime}
                minDate={new Date()}
                onChange={e => setStartTime(e.value)}
                readOnlyInput
                showTime
              />
            </div>
            <div className="modal-item">
              <label htmlFor="end_time">End Time</label>
              <Calendar
                id="end_time"
                value={addMinuteValue.getTime() > endTime.getTime() ? addMinuteValue : endTime}
                minDate={addMinuteValue}
                onChange={e => setEndTime(e.value)}
                readOnlyInput
                showTime
              />
            </div>
          </div>
          <div className="btn-group">
            <button 
              className="btn-create"
              onClick={handleCreate}
              disabled={isEnableCreate ? false : true}
            >Create</button>
            <button
              className="btn-cancel"
              onClick={handleClose}
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReservationModal;