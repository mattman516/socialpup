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
import moment from 'moment';
import Form from 'react-bootstrap/Form';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import ReactMapGL, { Marker } from 'react-map-gl';
import { setWalk, fetchWalks, deleteWalk } from './actions';
import AddFollowers from '../AddFollowers';
import 'mapbox-gl/dist/mapbox-gl.css';
import saga from './saga';
import reducer from './reducer';
import { makeSelectWalkList } from './selectors';

export default function MapPage() {
  const dispatch = useDispatch();
  useInjectSaga({ key: 'map', saga });
  useInjectReducer({ key: 'map', reducer });
  const walkList = useSelector(makeSelectWalkList());
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
    handleSetCurrentLocation();
  }, []);

  const handleSetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(x => {
      dispatch(fetchWalks());
      setLat(x.coords.latitude);
      setLong(x.coords.longitude);
      setCurrLocationMark([x.coords.latitude, x.coords.longitude]);
      console.log('LOCATION', latitude, longitude);
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
    console.log('WALKENDS', e);
    if (e.target.id === 'walktime') {
      const walkEnds = getDate(e.target.value);
      setWalkEvent({
        ...walkEvent,
        walkEnds,
      });
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Helmet>
        <title>Map Page</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} >

      <Button type="button" onClick={handleSetCurrentLocation}>
        my location
      </Button>
      <AddFollowers/>
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
          <div>curr</div>
        </Marker>
        {walkList.map(walk => (
          <Marker
            key={walk.id}
            latitude={walk.latitude}
            longitude={walk.longitude}
            offsetLeft={0}
            offsetTop={0}
          >
            <div onClick={handleDeleteWalk(walk)}>eyyy</div>
          </Marker>
        ))}
      </ReactMapGL>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header>Create Walk</Modal.Header>
        <Modal.Body>
          <Form onChange={handleFormChange}>
            <Form.Control id="walktime" as="select" defaultValue={30}>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map(val => (
                <option value={val}>{val}</option>
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

const getDate = (timeAdd) => (moment(new Date())
  .add(timeAdd, 'm')
  .format('X'));