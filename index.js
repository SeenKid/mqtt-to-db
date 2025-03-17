// Send mqtt informations into database
// Mosquitto MQTT Broker & MySQL
// By SeenKid

const mqtt = require('mqtt');
const mysql = require('mysql2/promise');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'mqtt-mysql.log' })
    ]
});

// Database CREDS
const dbConfig = {
    host: 'IP DE LA DB',
    user: 'USERNAME',
    password: 'MDP',
    database: 'DTABASE',
    connectionLimit: 10
};

// MQTT Broker CREDS
const mqttConfig = {
    broker: 'mqtt://IP DU BROKER',
    topics: ['owntracks/ID/TOPIC', 'owntracks/aa/TOPIC2'],
    clientId: `mqtt-mysql-${Math.random().toString(16).slice(2)}`
};

class MqttToMysqlBridge {
    constructor() {
        this.mqttClient = null;
        this.dbPool = null;
    }

    async initialize() {
        try {
            this.dbPool = await mysql.createPool(dbConfig);

            await this.createTable();

            this.connectMqtt();
        } catch (error) {
            logger.error(`Initialization error: ${error.message}`);
        }
    }

    async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS location_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                device_id VARCHAR(50),
                tid VARCHAR(50),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                altitude DECIMAL(10, 2),
                accuracy INT,
                battery INT,
                velocity DECIMAL(10, 2),
                timestamp TIMESTAMP,
                raw_payload JSON,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        try {
            await this.dbPool.execute(createTableQuery);
            logger.info('Location data table created or already exists');
        } catch (error) {
            logger.error(`Table creation error: ${error.message}`);
        }
    }

    connectMqtt() {
        this.mqttClient = mqtt.connect(mqttConfig.broker, {
            clientId: mqttConfig.clientId,
            clean: true,
            reconnectPeriod: 1000
        });

        this.mqttClient.on('connect', () => {
            logger.info(`Connected to MQTT broker: ${mqttConfig.broker}`);
            
            // S'abonner à tous les topics configurés
            mqttConfig.topics.forEach(topic => {
                this.mqttClient.subscribe(topic, (err) => {
                    if (err) {
                        logger.error(`Subscription error for topic ${topic}: ${err.message}`);
                    } else {
                        logger.info(`Subscribed to topic: ${topic}`);
                    }
                });
            });
        });

        this.mqttClient.on('message', async (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                await this.processMessage(topic, payload);
            } catch (error) {
                logger.error(`Message processing error: ${error.message}`);
            }
        });

        this.mqttClient.on('error', (error) => {
            logger.error(`MQTT Client Error: ${error.message}`);
        });
    }

    async processMessage(topic, payload) {
        if (payload._type !== 'location') return;

        try {
            const insertQuery = `
                INSERT INTO location_data 
                (device_id, tid, latitude, longitude, altitude, accuracy, 
                battery, velocity, timestamp, raw_payload) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), ?)
            `;

            const values = [
                payload._id,
                payload.tid || null,
                payload.lat,
                payload.lon,
                payload.alt || null,
                payload.acc || null,
                payload.batt || null,
                payload.vel || null,
                payload.tst,
                JSON.stringify(payload)
            ];

            const [result] = await this.dbPool.execute(insertQuery, values);
            logger.info(`Inserted location data for device: ${payload._id}`);
        } catch (error) {
            logger.error(`Database insertion error: ${error.message}`);
        }
    }
}

async function main() {
    const bridge = new MqttToMysqlBridge();
    await bridge.initialize();
}

main().catch(error => {
    logger.error(`Unhandled error: ${error.message}`);
    process.exit(1);
});
