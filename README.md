# MQTT to DB

`mqtt-to-db` is a Node.js script that allows you to record data retrieved from an MQTT server into a MySQL database. This project is ideal for IoT applications that require data persistence in a relational database. I use it for OwnTracks.

## Features

- Connect to an MQTT server to receive messages.
- Store MQTT messages in a MySQL database.
- Use Winston for logging events and errors.

## Prerequisites

- Node.js (version 14 or higher)
- An accessible MQTT server
- A configured MySQL database

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/SeenKid/mqtt-to-db.git
    cd mqtt-to-db
    ```

2. Install the dependencies:

    ```bash
    npm i
    ```

## Configuration

Edit the `index.js` file to fill the missing database and mqtt broker credentials.

## Launch
    
    node index.js
    
