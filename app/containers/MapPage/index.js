/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { FaMapMarker, FaGlobe } from 'react-icons/fa';
import { MdGpsFixed } from 'react-icons/md';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import ReactMapGL, { Marker } from 'react-map-gl';
import { setWalk, fetchWalks, deleteWalk, fetchFollowedWalks, fetchAllWalks } from './actions';
import AddFollowers from '../AddFollowers';
import 'mapbox-gl/dist/mapbox-gl.css';
import saga from './saga';
import reducer from './reducer';
import { makeSelectWalkList, makeSelectOtherWalkList } from './selectors';
import { makeSelectCurrentUser } from '../App/selectors';

export default function MapPage() {
  const dispatch = useDispatch();
  useInjectSaga({ key: 'map', saga });
  useInjectReducer({ key: 'map', reducer });
  const currUser = useSelector(makeSelectCurrentUser());
  const walkList = useSelector(makeSelectWalkList());
  const otherWalkList = useSelector(makeSelectOtherWalkList());
  const [latitude, setLat] = React.useState(37.7577);
  const [longitude, setLong] = React.useState(-122.4376);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [walkEvent, setWalkEvent] = React.useState();
  const [currLocationMark, setCurrLocationMark] = React.useState([1, 2]);
  const [viewport, setViewport] = React.useState({
    width: '100%',
    height: 400,
    zoom: 12,
  });

  React.useEffect(() => {
    console.log('currUser', currUser);
    handleSetCurrentLocation();
  }, [currUser.id]);

  const handleSetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(x => {
      dispatch(fetchWalks());
      dispatch(fetchFollowedWalks());
      setCurrLocationMark([x.coords.latitude, x.coords.longitude]);
      console.log('LOCATION', latitude, longitude);
      setLat(x.coords.latitude);
      setLong(x.coords.longitude);
      setViewport({ ...viewport, latitude, longitude });
    });
  };

  const handleViewportChange = view => {
    setLong(view.longitude);
    setLat(view.latitude);
    setViewport(view);
  };

  const handleMapClick = clickE => {
    setModalOpen(true);
    setWalkEvent({
      walkEnds: getDate(30),
      latitude: `${clickE.lngLat[1]}`,
      longitude: `${clickE.lngLat[0]}`,
    });
  };
  const handleWalkCreate = () => {
    setModalOpen(false);
    dispatch(setWalk(walkEvent));
  };
  const handleCancelWalkCreate = () => {
    setModalOpen(false);
    setWalkEvent();
  };
  const handleDeleteWalk = walk => () => {
    console.log('HANLDE_DELETE');
    dispatch(deleteWalk(walk));
  };
  const handleFormChange = e => {
    if (e.target.id === 'walktime') {
      const walkEnds = getDate(e.target.value);
      setWalkEvent({
        ...walkEvent,
        walkEnds,
      });
    } else if (e.target.id === 'walkname') {
      setWalkEvent({
        ...walkEvent,
        name: e.target.value,
      });
    }
  };
  const handleOtherButtonClick = e => {
    if (e.target.value === 'All Others') {
      dispatch(fetchAllWalks());
    } else if (e.target.value === 'Only Followed') {
      dispatch(fetchFollowedWalks());
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <Helmet>
        <title>Map Page</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: 30,
          marginTop: 0,
        }}
      >
        <Button
          type="button"
          onClick={handleSetCurrentLocation}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FaGlobe /> Find Me
        </Button>
        <ButtonGroup toggle onChange={handleOtherButtonClick}>
          <ToggleButton type="radio" name="radio" defaultChecked value="All Others">
            All Others
          </ToggleButton>
          <ToggleButton type="radio" name="radio" value="Only Followed">
            Only Following
          </ToggleButton>
        </ButtonGroup>
        <AddFollowers />
      </div>
      <ReactMapGL
        {...viewport}
        latitude={latitude}
        longitude={longitude}
        mapboxApiAccessToken="pk.eyJ1IjoibWF0dG1hbjUxNiIsImEiOiJjazc5NjA0cWUwcHd3M3RwNWI2NTY0eWV3In0.vHHG1fz0pAZ-TZxA8DqNUQ"
        onViewportChange={handleViewportChange}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleMapClick}
      >
        <Marker
          latitude={currLocationMark[0]}
          longitude={currLocationMark[1]}
          offsetLeft={0}
          offsetTop={0}
        >
          <MdGpsFixed />
        </Marker>
        {otherWalkList.map(walk => (
          <Marker
            key={walk.id}
            latitude={walk.latitude}
            longitude={walk.longitude}
            offsetLeft={0}
            offsetTop={0}
          >
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{walk.name}</Tooltip>}
            >
              <FaMapMarker
                onClick={handleDeleteWalk(walk)}
                style={{ color: 'red' }}
              />
            </OverlayTrigger>
          </Marker>
        ))}
        {walkList.map(walk => (
          <Marker
            key={walk.id}
            latitude={walk.latitude}
            longitude={walk.longitude}
            offsetLeft={0}
            offsetTop={0}
          >
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{walk.name}</Tooltip>}
            >
              <FaMapMarker onClick={handleDeleteWalk(walk)} />
            </OverlayTrigger>
          </Marker>
        ))}
      </ReactMapGL>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header>Create Walk</Modal.Header>
        <Modal.Body>
          <Form onChange={handleFormChange}>
            <Form.Control
              id="walkname"
              type="text"
              placeholder="Where you going?"
            />
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
    </div>
  );
}

const getDate = timeAdd =>
  moment(new Date())
    .add(timeAdd, 'm')
    .format('X');
