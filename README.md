# nomadPi React Frontend

This project provides a React-based UI for the nomadPi API. It allows to interact with all the functionalities provided by the [nomadPi core API](https://github.com/coconup/nomadpi-core-api) and [nomadPi automation API](https://github.com/coconup/nomadpi-automation-api).

This project is undergoing active development and has to be treated as work in progress.

## Features

* **Settings:** Easily configure various parameters for your Campervan, such as batteries, GPS, and Zigbee USB devices.

* **Switches:** Create, organize and operate different types of switches (Relays, WiFi Relays, Modes, and Action Switches)

* **Modes:** Establish custom modes through the UI to automate specific actions through [nomadPi automation](https://github.com/coconup/nomadpi-automation-api).

* **Action Switches:** Use specialized buttons to control a combination of Relays and WiFi Relays, forcing their state to either ON or OFF while the button is active. Conflicts with other switches are handled automatically.

## Note

Settings, including batteries, GPS, and Zigbee USB devices, will be remembered even if you swap ports or add a USB Hub, offering improved flexibility over the original implementation.