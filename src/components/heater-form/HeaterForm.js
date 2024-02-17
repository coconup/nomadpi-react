import { useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Divider,
  TextField,
} from '@mui/material';

import UsbDeviceSelect from '../usb-device-select/UsbDeviceSelect';

import Select from '../ui/Select';

import Heater from '../../models/Heater';

export default function HeaterForm({heater, onChange, temperatureSensors=[], switchesOptions=[]}) {
  const {
    name,
    vendor_id,
    product_id,
    vendor_id_options,
    product_id_options,
    connection_type_options,
    connection_type,
    connection_params={},
    heater_settings
  } = heater;

  const {
    product_id: usb_product_id,
    vendor_id: usb_vendor_id,
    serial_id
  } = connection_params;

  const {
    thermostat={}
  } = heater_settings;

  const {
    temperature_sensor_id,
    switch_id
  } = thermostat;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(heater, {name: event.target.value})}
        />
        <Select
          label={"Vendor"}
          value={vendor_id}
          options={vendor_id_options}
          onChange={(event) => {
            onChange(heater, {vendor_id: event.target.value, product_id: null, connection_type: null, connection_params: {}})}
          }
        />
        <Select
          label={"Product"}
          value={product_id}
          options={product_id_options}
          onChange={(event) => onChange(heater, {product_id: event.target.value, connection_type: null, connection_params: {}})}
        />
        <Select
          label={"Connection type"}
          value={connection_type}
          options={connection_type_options}
          onChange={(event) => onChange(heater, {connection_type: event.target.value, connection_params: {}})}
        />
        {
          connection_type === 'usb' && (
            <UsbDeviceSelect
              label="USB Device"
              value={{ vendor_id: usb_vendor_id, product_id: usb_product_id, serial_id }}
              attributes={['vendor_id', 'product_id', 'serial_id']}
              onChange={({ vendor_id, product_id, serial_id }) => onChange(heater, {connection_params: {...connection_params, vendor_id, product_id, serial_id}})}
            />
          )
        }
        <Divider />
        <Select
          label={"Thermostat temperature sensor"}
          value={temperature_sensor_id}
          options={temperatureSensors.map(({id: value, name: label}) => ({label, value}))}
          onChange={(event) => onChange(heater, {heater_settings: {...heater_settings, thermostat: {...thermostat, temperature_sensor_id: event.target.value}}})}
        />
        <Select
          label={"Thermostat associated switch"}
          value={switch_id}
          options={switchesOptions.map(({id, name, type}) => ({ value: JSON.stringify({ id, type }), label: name}))}
          onChange={(event) => onChange(heater, {heater_settings: {...heater_settings, thermostat: {...thermostat, switch_id: event.target.value}}})}
        />
      </CardContent>
    </Card>
  );
}