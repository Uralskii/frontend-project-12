import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { setModalShow } from '../../slices/modalSlice';

// eslint-disable-next-line object-curly-newline
const RemovableChannel = ({ id, name, isCurrent, changeChannel }) => {
  const channelId = useSelector((state) => state.channels.activeChannelId);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleModalShow = (type) => () => {
    dispatch(setModalShow({ type }));
  };

  return (
    <Dropdown key={id} className="d-flex" as={ButtonGroup}>
      <Button
        type="button"
        className="w-100 rounded-0 text-start text-truncate"
        onClick={changeChannel(id, name)}
        variant={isCurrent(channelId, id)}
      >
        <span className="me-1">#</span>
        {name}
      </Button>
      <Dropdown.Toggle
        split
        variant={isCurrent(channelId, id)}
        id="dropdown-split-basic"
      >
        <span className="visually-hidden">{t('buttons.channels.control')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item data-type="removing" onClick={handleModalShow('removing')}>{t('buttons.channels.remove')}</Dropdown.Item>
        <Dropdown.Item onClick={handleModalShow('renaming')}>{t('buttons.channels.rename')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RemovableChannel;
