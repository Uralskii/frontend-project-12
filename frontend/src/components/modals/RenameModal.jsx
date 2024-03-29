import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import { io } from 'socket.io-client';
import * as yup from 'yup';

import routes from '../../routes.js';
import getAuthHeader from '../../utilities/getAuthHeader.js';
import notification from '../toast/index.js';

import { updateChannel, channelsSelectors, changeChannel } from '../../slices/channelSlice';

const socket = io();

const RenameModal = ({ isOpen, close }) => {
  const channels = useSelector(channelsSelectors.selectAll);
  const channelsName = channels.map((channel) => channel.name);
  const { id, name } = useSelector((state) => state.channels.activeChannel);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const inputElem = useRef(null);
  useEffect(() => {
    inputElem.current.select();
  }, []);

  const validationSchema = yup.object().shape({
    name: yup.string()
      .required()
      .min(3, t('errors.username'))
      .max(20, t('errors.username'))
      .notOneOf(channelsName, t('errors.channelName')),
  });

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name,
    },
    onSubmit: async (values) => {
      try {
        await axios.patch(routes.idChannelPath(id), values, { headers: getAuthHeader() });
        socket.emit('renameChannel');
        notification.successToast(t('toast.channelRename'));
        close();
      } catch (err) {
        console.log(err);
        notification.errorNotify(t('errors.network'));
      }
    },
  });

  useEffect(() => {
    socket.on('renameChannel', (payload) => {
      dispatch(changeChannel(payload));
      dispatch(updateChannel({ id: payload.id, changes: { name: payload.name } }));
    });
  }, []);

  return (
    <Modal centered show={isOpen}>
      <Modal.Header closeButton onHide={close}>
        <Modal.Title>{t('modals.renameTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              name="name"
              id="name"
              required
              type="text"
              data-testid="input-body"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.errors.name && formik.touched.name}
              ref={inputElem}
            />
            <label htmlFor="name">{t('modals.channelName')}</label>
            <div className="invalid-tooltip">{formik.errors.name}</div>
          </Form.Floating>
          <div className="d-flex justify-content-end">
            <Button onClick={close} type="button" className="btn-secondary mt-2 me-2">{t('buttons.channels.back')}</Button>
            <Button disabled={formik.isSubmitting} type="submit" className="btn-primary mt-2">{t('buttons.channels.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameModal;
