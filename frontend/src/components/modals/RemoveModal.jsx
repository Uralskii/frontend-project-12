import React from 'react';
import { useSelector } from 'react-redux';
import {
  Modal, FormGroup, Form, Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { getActiveChannelId } from '../../slices/selectors';

import routes from '../../routes';
import getAuthHeader from '../../utilities/getAuthHeader';
import notification from '../toast';

const RemoveModal = ({ isOpen, close }) => {
  const channelId = useSelector(getActiveChannelId);

  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      axios.delete(routes.idChannelPath(channelId), { headers: getAuthHeader() });
      notification.successToast(t('toast.channelRemove'));
      close();
    } catch (err) {
      console.log(err);
      notification.errorNotify(t('errors.network'));
    }
  };

  return (
    <Modal centered show={isOpen}>
      <Modal.Header closeButton onHide={close}>
        <Modal.Title>{t('modals.removeTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <p className="lead">{t('modals.removeBody')}</p>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button onClick={close} type="button" className="btn-secondary mt-2 me-2">{t('buttons.channels.back')}</Button>
            <Button type="submit" className="btn-danger mt-2">{t('buttons.channels.remove')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveModal;
