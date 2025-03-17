<div align="center">
  <h1><code>MQTT To DB</code></h1>
  <p>
    <strong>Script to register your MQTT entries to your Database</strong><br/>
  </p>
  <p style="margin-bottom: 0.5ex;">
    <img
        src="https://img.shields.io/github/downloads/SeenKid/mqtt-to-db/total"
    />
    <img
        src="https://img.shields.io/github/repo-size/SeenKid/mqtt-to-db"
    />
        <a href="https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2FSeenKid%2Fmqtt-to-db"><img src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FSeenKid%2Fmqtt-to-db&label=Views&labelColor=%23ff8a65&countColor=%23f47373" /></a>
  </p>
</div>

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
    
