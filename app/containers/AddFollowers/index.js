import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import FollowingUser from '../FollowingUser';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { fetchAllUsers, addFollower, updateLookback } from './actions';
import saga from './saga';
import reducer from './reducer';
import { makeSelectUserList } from './selectors';
import { makeSelectCurrentUser } from '../App/selectors';
import Modal from 'react-bootstrap/Modal';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function AddFollowers() {
  const dispatch = useDispatch();
  const userList = useSelector(makeSelectUserList());
  const currentUser = useSelector(makeSelectCurrentUser());
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentNewFollower, setCurrentNewFollower] = React.useState();
  const [defaultVal, setDefaultVal] = React.useState('');
  useInjectSaga({ key: 'followers', saga });
  useInjectReducer({ key: 'followers', reducer });

  React.useEffect(() => {
    const startLookback  = lookbackValues.find(x => x.value === currentUser.previousWalkLookback);
    const label = startLookback ? startLookback.label : 'All';
    setDefaultVal(label);
  }, [currentUser])

  const handleButtonClick = e => {
    // setCurrentUser()
    dispatch(fetchAllUsers());
    setModalOpen(true);
  };

  const handleFormChange = val => {
    setCurrentNewFollower(val[0].owner);
  }

  const handleSubmit = () => {
    if (currentNewFollower) {
      dispatch(addFollower(currentNewFollower));
    }
    handleClose();
  }
  const handleClose = () => {
    setModalOpen(false);
  }
  const handleLookbackTime = (val) => {
    if (val[0]) {
      dispatch(updateLookback(val[0].value));
    }
  }

  return (
    <React.Fragment>
      <Button type="button" onClick={handleButtonClick}>
        Following
      </Button>
      <Modal show={modalOpen} onHide={handleClose}>
        <Modal.Header>Find Pup</Modal.Header>
        <Modal.Body>
          <label htmlFor='lookback'>Walk lookback time...</label>
          <Typeahead
            id={'lookback'}
            options={lookbackValues}
            defaultInputValue={defaultVal}
            labelKey="label"
            onChange={handleLookbackTime}
            autoFocus
            label="Include walks ending how many minutes ago"
          />
          <label htmlFor='userList'>Follow new pups...</label>
          <Typeahead
            id={'userList'}
            options={userList}
            labelKey="owner"
            onChange={handleFormChange}
            autoFocus
            placeholder="Search for user..."
          />
          <div>
            <h6>Already following:</h6>
            {(currentUser.following || []).map((u, key) => (
              <FollowingUser key={`${u}${key}`} username={u} />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Follow Pup
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

const lookbackValues = [
  {value: 0, label: 'Now' },
  {value: 15, label: '15 min ago' },
  {value: 30, label: '30 min ago' },
  {value: 60, label: '1 hour ago' },
  {value: 120, label: '2 hours ago' },
  {value: 'all', label: 'all time' },
]
