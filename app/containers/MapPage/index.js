/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FindMeButton from '../../components/FindMeButton';
import ToggleButton from 'react-bootstrap/ToggleButton';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaMapMarker } from 'react-icons/fa';
import { MdGpsFixed } from 'react-icons/md';
import { CreateWalkModal } from '../CreateWalk';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
import { fetchWalks, deleteWalk, fetchFollowedWalks, fetchAllWalks, unsubscribeToWalks, subscribeToWalks, setListVisible } from './actions';
import AddFollowers from '../AddFollowers';
import PreviousWalks from '../PreviousWalks';
import 'mapbox-gl/dist/mapbox-gl.css';
import saga from './saga';
import { makeSelectWalkList, makeSelectOtherWalkList, makeSelectLatLng, makeSelectListVisible } from './selectors';
import { makeSelectCurrentUser } from '../App/selectors';
import { toggleCreateWalkModal } from '../CreateWalk/actions';
import * as Layers from './layers';

export default function MapPage() {
  const dispatch = useDispatch();
  useInjectSaga({ key: 'map', saga });
  useInjectReducer({ key: 'map', reducer });
  const currUser = useSelector(makeSelectCurrentUser());
  const walkList = useSelector(makeSelectWalkList());
  const otherWalkList = useSelector(makeSelectOtherWalkList());
  const relocateLatLng = useSelector(makeSelectLatLng());
  const listVisible = useSelector(makeSelectListVisible());
  const [latitude, setLat] = React.useState(37.7577);
  const [longitude, setLong] = React.useState(-122.4376);
  const [positionLoad, setPositionLoad] = React.useState(false);
  const [otherWalksToggle, setOtherWalksToggle] = React.useState('Only Followed');
  const [currLocationMark, setCurrLocationMark] = React.useState([1, 2]);
  const [viewport, setViewport] = React.useState({
    width: '100%',
    height: '70vh',
    zoom: 12,
  });

  React.useEffect(() => {
    handleSetCurrentLocation();
    return function cleanup() { // clean up
      console.log("CLEANUP")
      dispatch(unsubscribeToWalks());
    }
  }, [currUser.id]);
  React.useEffect(() => {
    if (relocateLatLng.length == 2) {
      setLat(relocateLatLng[0]);
      setLong(relocateLatLng[1]);
    }
  }, [relocateLatLng])
  let _sourceRef = React.createRef();

  const handleSetCurrentLocation = () => {
    console.log('GET CURR LOCATION');
    setPositionLoad(true);
    navigator.geolocation.getCurrentPosition(x => {
      setPositionLoad(false);
      dispatch(fetchWalks());
      dispatch(fetchFollowedWalks());
      dispatch(subscribeToWalks());
      setCurrLocationMark([x.coords.latitude, x.coords.longitude]);
      setLat(x.coords.latitude);
      setLong(x.coords.longitude);
      setViewport({ ...viewport, latitude, longitude });
    }, x => {
      console.error(x);
      setPositionLoad(false);
    });
  };

  const handleViewportChange = view => {
    setLong(view.longitude);
    setLat(view.latitude);
    setViewport(view);
  };

  const handleMapClick = clickE => {
    if (clickE.features[0]) { 
      // zoom map on cluster
      const feature = clickE.features[0];
      const clusterId = feature.properties.cluster_id;
  
      const mapboxSource = _sourceRef.current.getSource();
  
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
  
        handleViewportChange({
          ...viewport,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          zoom,
          transitionDuration: 100
        });
      });
    } else {
      dispatch(toggleCreateWalkModal(
        {
          latitude: `${clickE.lngLat[1]}`,
          longitude: `${clickE.lngLat[0]}`,
        },
      ));
    }
  };
  const handleDeleteWalk = walk => () => {
    dispatch(deleteWalk(walk));
  };
  const handleOtherButtonClick = e => {
    setOtherWalksToggle(e.target.value);
    if (e.target.value === 'All Others') {
      dispatch(fetchAllWalks());
    } else if (e.target.value === 'Only Followed') {
      dispatch(fetchFollowedWalks());
    }
  }
  const handlePreviewToggle = () => {
    dispatch(setListVisible())
  }

  return (
    <React.Fragment>
      <div style={{ width: '100%', position: 'fixed', top: 67, paddingTop: 0, backgroundColor: 'white' }}>
        <HeaderButtons
          {...{
            handleSetCurrentLocation,
            positionLoad,
            otherWalksToggle,
            handleOtherButtonClick,
          }}
        />
        <Map 
          {...{
            viewport,
            latitude,
            longitude,
            handleViewportChange,
            handleMapClick,
            otherWalkList,
            _sourceRef,
            currLocationMark,
            walkList,
            handleDeleteWalk
          }}
        />
        <ReturnFromPreview {...{handlePreviewToggle, listVisible}} />
        <CreateWalkModal />
      </div>
      <PreviousWalks />
    </React.Fragment>
  );
}


const Map = ({viewport, latitude, longitude, handleViewportChange, handleMapClick, otherWalkList, _sourceRef, currLocationMark, walkList, handleDeleteWalk}) => {
  return (
    <ReactMapGL
      {...viewport}
      latitude={latitude}
      longitude={longitude}
      mapboxApiAccessToken="pk.eyJ1IjoibWF0dG1hbjUxNiIsImEiOiJjazc5NjA0cWUwcHd3M3RwNWI2NTY0eWV3In0.vHHG1fz0pAZ-TZxA8DqNUQ"
      onViewportChange={handleViewportChange}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onClick={handleMapClick}
      interactiveLayerIds={['clusters']}
    >
      <Source type="geojson" data={convertToGeoJSON(otherWalkList)} cluster={true} clusterRadius={50} clusterMaxZoom={14} ref={_sourceRef}>
        <Layer {...Layers.clusterLayer}/>
        <Layer {...Layers.clusterCountLayer}/>
        <Layer {...Layers.unclusteredPointLayer}/>
      </Source>
      <Marker
        latitude={currLocationMark[0]}
        longitude={currLocationMark[1]}
        offsetLeft={-10}
        offsetTop={-12}
      >
        <MdGpsFixed style={{ fontSize: 20 }} />
      </Marker>
      {walkList.map(walk => (
        <Marker
          key={walk.id}
          latitude={walk.latitude}
          longitude={walk.longitude}
          offsetLeft={-10}
          offsetTop={-20}
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{walk.name}</Tooltip>}
          >
            <FaMapMarker style={{ fontSize: 20, color: 'tomato' }} onClick={handleDeleteWalk(walk)} />
          </OverlayTrigger>
        </Marker>
      ))}
    </ReactMapGL>
  )
}

const HeaderButtons = ({handleSetCurrentLocation, positionLoad, otherWalksToggle, handleOtherButtonClick}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        margin: 15,
        marginTop: 5,
      }}
    >
      <div
        style={{
          alignSelf: 'flex-top',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: 5,
        }}
      >
        <FindMeButton {...{handleSetCurrentLocation, positionLoad}} />
        <AddFollowers />
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignSelf: 'flex-bottom',
          padding: 5,
        }}
      >
        <ButtonGroup toggle onChange={handleOtherButtonClick} value={otherWalksToggle} >
          <ToggleButton type="radio" name="radio" value="All Others" checked={(otherWalksToggle === 'All Others')}>
            All Others
          </ToggleButton>
          <ToggleButton type="radio" name="radio" value="Only Followed" checked={(otherWalksToggle === 'Only Followed')}>
            Only Following
          </ToggleButton>
        </ButtonGroup>
      </div>
    </div>
  )
}

const ReturnFromPreview = ({handlePreviewToggle, listVisible}) => {
  const zIndex = listVisible ? -1 : 2;
  return (
    <div style={{ zIndex, width: '100vw', position: 'fixed', bottom: 0, height: 100, backgroundColor: 'white' }}>
      <Button onClick={handlePreviewToggle}style={{ margin: 30 }} >Return to Preview</Button>
    </div>
  )
}

const convertToGeoJSON = (walkList) => {
  const features = walkList.map(walk => ({
    type: 'Feature',
    properties: walk,
    geometry: {
      type: 'Point',
      coordinates: [walk.longitude, walk.latitude],
    },
  }));

  return {
    features,
    type: 'FeatureCollection'
  };
}
