import React from 'react';
import { useDispatch } from 'react-redux';
import { unfollowUser } from './actions';
import { useInjectSaga } from 'utils/injectSaga';
import { MdDelete } from 'react-icons/md'
import saga from './saga';

export default function FollowingUser({ username }) {
  const dispatch = useDispatch();
  useInjectSaga({ key: 'followingUser', saga });

  const handleDelete = () => {
    console.log('DELETE', username);
    dispatch(unfollowUser(username));
  }
  

  return (
    <div style={{ display: 'flex' }}>
      <MdDelete onClick={handleDelete} style={{ marginRight: 10 }} />
      <h6>{username}</h6>
    </div>
  );
}
