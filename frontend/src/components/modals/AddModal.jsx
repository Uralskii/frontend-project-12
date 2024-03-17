import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  Form,
} from 'react-bootstrap';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import routes from '../../routes.js';
import getAuthHeader from '../../utilities/getAuthHeader.js';
import { addChannel, channelsSelectors } from '../../slices/channelSlice.js';

const socket = io();

const AddModal = (props) => {
  const { onHide, changeChannel } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsName = channels.map((channel) => channel.name);

  const inputElem = useRef(null);
  useEffect(() => {
    inputElem.current.focus();
  }, []);

  const notify = () => toast.success(t('toast.channelAdd'), {
    position: 'top-right',
    autoClose: 3000,
  });

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
        notify();
        onHide();
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    socket.on('newChannel', (payload) => {
      dispatch(addChannel(payload));
      changeChannel(payload.id, payload.name);
    });
  }, []);

  return (
    <Modal centered show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.addTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputElem}
              onChange={formik.handleChange}
              value={formik.values.body}
              data-testid="input-body"
              name="name"
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <FormControl.Feedback type="invalid" tooltip>{formik.errors.name}</FormControl.Feedback>
          </FormGroup>
          <Form.Label visuallyHidden htmlFor="name">{t('modals.channelName')}</Form.Label>
          <div className="d-flex justify-content-end">
            <Button onClick={onHide} type="button" className="btn-secondary mt-2 me-2">{t('buttons.channels.back')}</Button>
            <Button type="submit" className="btn-primary mt-2">{t('buttons.channels.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
