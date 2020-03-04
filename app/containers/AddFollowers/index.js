import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import FollowingUser from '../FollowingUser';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { fetchAllUsers, addFollower } from './actions';
import saga from './saga';
import reducer from './reducer';
import { makeSelectUserList } from './selectors';
import { makeSelectCurrentUser } from '../App/selectors';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function AddFollowers() {
  const dispatch = useDispatch();
  const userList = useSelector(makeSelectUserList());
  const currentUser = useSelector(makeSelectCurrentUser());
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentNewFollower, setCurrentNewFollower] = React.useState();
  useInjectSaga({ key: 'followers', saga });
  useInjectReducer({ key: 'followers', reducer });

  const handleButtonClick = e => {
    console.log('HANDLE_BUTTON_CLICK')
    // setCurrentUser()
    dispatch(fetchAllUsers());
    setModalOpen(true);
  };

  const handleFormChange = e => {
    if (e.target.id === 'userList') {
      setCurrentNewFollower(e.target.value);
    }
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

  return (
    <React.Fragment>
      <Button type="button" onClick={handleButtonClick}>
        Following
      </Button>
      <Modal show={modalOpen} onHide={handleClose}>
        <Modal.Header>Find Pup</Modal.Header>
        <Modal.Body>
          <Form onChange={handleFormChange}>
            <Form.Control id="userList" as="select" defaultValue={''}>
              <option value={''}>Pick a pup to follow...</option>
              {userList.map(val => (
                <option key={val.owner} value={val.owner}>{val.owner}</option>
              ))}
            </Form.Control>
          </Form>
          <div>
            <h6>Already following:</h6>
            {(currentUser.following || []).map(u => (
              <FollowingUser username={u} />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Follow Pup
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
