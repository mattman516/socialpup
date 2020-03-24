
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCreateWalkModal } from './actions';
import { makeSelectModalOpen } from './selectors';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import 'mapbox-gl/dist/mapbox-gl.css';

export const CreateWalkModal = ({ handleCancelWalkCreate, handleWalkCreate}) => {

  useInjectReducer({ key: 'create', reducer });
  const dispatch = useDispatch();
  const modalOpen = useSelector(makeSelectModalOpen());

    const handleFormChange = e => {
        if (e.target.id === 'walktime') {
        // const walkEnds = getDate(e.target.value);
        // setWalkEvent({
        //     ...walkEvent,
        //     walkEnds,
        // });
        console.log(e);
        } else if (e.target.id === 'walkname') {
        // setWalkEvent({
        //     ...walkEvent,
        //     name: e.target.value,
        // });
        console.log(e);
        }
    };

    const handleModalToggle = () => {
      dispatch(toggleCreateWalkModal());
    }

    return (
      <Modal show={modalOpen} onHide={handleModalToggle}>
        <Modal.Header>Create Walk</Modal.Header>
        <Modal.Body>
          <Form onChange={handleFormChange}>
            <label htmlFor='walkname'>Destination</label>
            <Form.Control
              id="walkname"
              type="text"
              placeholder="Where you going?"
            />
            <label htmlFor='walktime'>Walk duration</label>
            <Form.Control id="walktime" as="select" defaultValue={30}>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map(val => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={handleCancelWalkCreate}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleWalkCreate}>
            Create Walk
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }


// const getDate = timeAdd =>
//   moment(new Date())
//     .add(timeAdd, 'm')
//     .format('X');