import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import { io } from 'socket.io-client';
import * as yup from 'yup';

import routes from '../../routes.js';
import notification from '../toast/index.js';
import getAuthHeader from '../../utilities/getAuthHeader.js';

import { addChannel, changeChannel, channelsSelectors } from '../../slices/channelSlice.js';

const socket = io();

const AddModal = ({ isOpen, close }) => {
  const channels = useSelector(channelsSelectors.selectAll);
  const channelsName = channels.map((channel) => channel.name);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const inputElem = useRef(null);
  useEffect(() => {
    inputElem.current.focus();
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
      name: '',
    },
    onSubmit: async ({ name }) => {
      try {
        await axios.post(routes.channelsPath(), { name }, { headers: getAuthHeader() });
        socket.emit('newChannel');
        notification.successToast(t('toast.channelAdd'));
        close();
      } catch (err) {
        console.log(err);
        notification.errorNotify(t('errors.network'));
      }
    },
  });

  useEffect(() => {
    socket.on('newChannel', (payload) => {
      dispatch(addChannel(payload));
      dispatch(changeChannel(payload));
    });
  }, []);

  return (
    <Modal centered show={isOpen}>
      <Modal.Header closeButton onHide={close}>
        <Modal.Title>{t('modals.addTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              name="name"
              id="name"
              required
              type="text"
              placeholder="Пароль"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.errors.name && formik.touched.name}
              ref={inputElem}
            />
            <label htmlFor="name">{t('modals.channelName')}</label>
            <div className="invalid-tooltip">{formik.errors.name}</div>
          </Form.Floating>
          <div className="d-flex justify-content-end mt-3">
            <Button onClick={close} type="button" className="btn-secondary mt-2 me-2">{t('buttons.channels.back')}</Button>
            <Button disabled={formik.isSubmitting} type="submit" className="btn-primary mt-2">{t('buttons.channels.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
