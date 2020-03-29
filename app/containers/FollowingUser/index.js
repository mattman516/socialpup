import React from 'react';
import { useDispatch } from 'react-redux';
import { unfollowUser } from './actions';
import { useInjectSaga } from 'utils/injectSaga';
import { FaTrash } from 'react-icons/fa'
import saga from './saga';
import IconButton from '../../components/IconButton';

export default function FollowingUser({ username }) {
  const dispatch = useDispatch();
  useInjectSaga({ key: 'followingUser', saga });

  const handleDelete = () => {
    console.log('DELETE', username);
    dispatch(unfollowUser(username));
  }
  

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h6>{username}</h6>
      <IconButton onClick={handleDelete}><FaTrash/></IconButton>
    </div>
  );
}
