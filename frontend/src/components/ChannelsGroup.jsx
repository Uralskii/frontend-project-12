import React, { useState } from 'react';
import {
  Col,
  Nav,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';

import { channelsSelectors } from '../slices/channelSlice';
import getModal from './modals/getModal';

// eslint-disable-next-line object-curly-newline, max-len
const renderModal = ({ channel, modalInfo, hideModal, changeActiveChannel, setActiveChannel, notify }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return (
    <Component
      channelInfo={channel}
      modalInfo={modalInfo}
      onHide={hideModal}
      changeChannel={changeActiveChannel}
      setChannel={setActiveChannel}
      notify={notify}
    />
  );
};

const ChannelsGroup = ({ channel, setActiveChannel }) => {
  const channels = useSelector(channelsSelectors.selectAll);
  const { t } = useTranslation();

  const [modalInfo, setModalInfo] = useState({ type: null });
  const hideModal = () => setModalInfo({ type: null });
  const showModal = (type) => setModalInfo({ type });

  const notify = () => toast.success('Канал создан!', {
    position: 'top-right',
    autoClose: 7000,
  });

  const changeActiveChannel = (id, name) => setActiveChannel({ id, name });
  const getClassName = (id) => cn('btn w-100 rounded-0 text-start', { 'btn-secondary': channel.id === id });

  return (
    <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('text.channels')}</b>
        <button onClick={() => showModal('adding')} type="button" className="p-0 text-primary btn btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">{t('buttons.chat.add')}</span>
        </button>
      </div>
      <Nav className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map(({ id, name, removable }) => {
          if (!removable) {
            return (
              <li key={id} className="nav-item w-100">
                <button id={id} type="button" className={getClassName(id)} onClick={() => changeActiveChannel(id, name)}>
                  <span className="me-1">#</span>
                  {name}
                </button>
              </li>
            );
          }
          return (
            <Dropdown key={id} className="d-flex" as={ButtonGroup}>
              <button type="button" id={id} className={getClassName(id)} onClick={() => changeActiveChannel(id, name)}>
                <span className="me-1">#</span>
                {filter.clean(name)}
              </button>
              <Dropdown.Toggle split variant={channel.id === id ? 'secondary' : 'none'} id="dropdown-split-basic" />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('removing')}>{t('buttons.channels.remove')}</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renaming')}>{t('buttons.channels.rename')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        })}
      </Nav>
      {renderModal({
        channel,
        modalInfo,
        hideModal,
        changeActiveChannel,
        setActiveChannel,
        notify,
      })}
      <ToastContainer />
    </Col>
  );
};

export default ChannelsGroup;