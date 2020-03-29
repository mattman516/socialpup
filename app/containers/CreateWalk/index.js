
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCreateWalkModal } from './actions';
import { setWalk } from '../MapPage/actions';
import { makeSelectModalOpen, makeSelectInitWalkState } from './selectors';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import 'mapbox-gl/dist/mapbox-gl.css';

export const CreateWalkModal = () => {

  useInjectReducer({ key: 'create', reducer });
  const dispatch = useDispatch();
  const modalOpen = useSelector(makeSelectModalOpen());
  const initWalk = useSelector(makeSelectInitWalkState());
  const [walkEvent, setWalkEvent] = React.useState(new Object({}));

  React.useEffect(() => {
    delete initWalk.id;
    setWalkEvent({
      ...initWalk,
      walkEnds: getDate(30),
      latitude: jiggle(initWalk.latitude),
      longitude: jiggle(initWalk.longitude),
    });
  }, [initWalk])

    const handleFormChange = e => {
        if (e.target.id === 'walktime') {
        const walkEnds = getDate(e.target.value);
        setWalkEvent({
            ...walkEvent,
            walkEnds,
        });
        console.log(e);
        } else if (e.target.id === 'walkname') {
        setWalkEvent({
            ...walkEvent,
            name: e.target.value,
        });
        }
    };
    const handleWalkCreate = () => {
      dispatch(toggleCreateWalkModal({}));
      dispatch(setWalk(walkEvent));
    };
    const handleCancelWalkCreate = () => {
      dispatch(toggleCreateWalkModal({}));
      setWalkEvent({});
    };
    const handleModalToggle = () => {
      dispatch(toggleCreateWalkModal({}));
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
              defaultValue={walkEvent['name']}
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

const getDate = timeAdd =>
  moment(new Date())
    .add(timeAdd, 'm')
    .format('X');

const jiggle = num => {
  const neg = Math.random() > 0.5 ? -1 : 1;
  const jig = (Math.round(Math.random() * 10)* 0.000001 * neg)
  console.log(num, jig, Number(parseFloat(num) + jig))
  return Number(parseFloat(num) + jig)
}